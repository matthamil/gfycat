import debug from 'debug';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { stringify } from 'query-string';
import { promises as fs } from 'fs';
import * as Gfycat from './api.types';

interface AuthToken {
  token: string;
  expiresAt: number;
}

const isExpired = (ms = 0) => ms >= Date.now();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class GfycatClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly username: string;
  private readonly password: string;
  private readonly httpClient: Axios;
  private accessToken: AuthToken | undefined;
  private refreshToken: AuthToken | undefined;

  constructor({
    clientId,
    clientSecret,
    username,
    password,
  }: {
    clientId: string;
    clientSecret: string;
    username: string;
    password: string;
  }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.username = username;
    this.password = password;
    this.httpClient = axios.create({
      baseURL: 'https://api.gfycat.com/v1',
    });

    const log = debug('gfycat');

    this.httpClient.interceptors.request.use(async (config) => {
      log(
        `${config.method?.toUpperCase().concat(' | ') ?? ''}${
          config.url ?? config.baseURL ?? ''
        }` || 'request'
      );

      // urls that do not need authentication
      if (
        config.url === '/oauth/token' ||
        config.baseURL?.includes('filedrop') ||
        config.url?.includes('filedrop')
      ) {
        return config;
      }
      await this.validateToken();
      if (!this.accessToken?.token) {
        return config;
      }
      return {
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${this.accessToken.token}`,
        },
      };
    });

    this.httpClient.interceptors.response.use((config) => {
      log(
        `${config.status}${
          config.data ? ' | ' + '\n' + JSON.stringify(config.data, null, 2) : ''
        }`
      );
      return config;
    });
  }

  private refreshAccessToken = async () => {
    if (!this.refreshToken || isExpired(this.refreshToken.expiresAt)) {
      return;
    }

    const res =
      await this.httpClient.post<Gfycat.OauthTokenPasswordGrantResponse>(
        '/oauth/token',
        {
          grant_type: 'refresh',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken.token,
        }
      );

    this.accessToken = {
      token: res.data.access_token,
      expiresAt: Date.now() + res.data.expires_in,
    };
    this.refreshToken = {
      token: res.data.refresh_token,
      expiresAt: Date.now() + res.data.refresh_token_expires_in,
    };
  };

  /**
   * Requests a new access token and refresh token
   */
  authenticate = async () => {
    const res = await this.httpClient.post<
      Gfycat.OauthTokenPasswordGrantRequest,
      AxiosResponse<Gfycat.OauthTokenPasswordGrantResponse>
    >(
      '/oauth/token',
      {
        grant_type: 'password',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        username: this.username,
        password: this.password,
      },
      {}
    );

    this.accessToken = {
      token: res.data.access_token,
      expiresAt: Date.now() + res.data.expires_in,
    };
    this.refreshToken = {
      token: res.data.refresh_token,
      expiresAt: Date.now() + res.data.refresh_token_expires_in,
    };
  };

  private validateToken = async () => {
    // client has already authenticated and has a valid refresh token
    if (
      this.refreshToken &&
      isExpired(this.accessToken?.expiresAt) &&
      !isExpired(this.refreshToken.expiresAt)
    ) {
      await this.refreshAccessToken();
      return;
    }
    if (!this.accessToken || isExpired(this.accessToken.expiresAt)) {
      await this.authenticate();
      return;
    }
  };

  /**
   * Requests and a JSON object containing information about a specified gfyname.
   */
  getGfycatInfo = async (gfyId: string) => {
    const res = await this.httpClient.get<Gfycat.GfycatResponse>(
      `/gfycats/${gfyId}`,
      {}
    );
    return res.data.gfyItem;
  };

  getUserGfycats = async ({
    userId,
    count = 30,
    cursor,
  }: {
    userId: string;
    count: number;
    cursor?: string;
  }) => {
    const query = stringify({
      count,
      cursor,
    });
    const url = `/users/${userId}/gfycats` + query ? `?${query}` : '';
    const { data } = await this.httpClient.get<Gfycat.GfycatsResponse>(url);
    return data;
  };

  getMyGfycats = async ({
    count = 30,
    cursor,
  }: {
    count?: number;
    cursor?: string;
  }) => {
    const query = stringify({
      count,
      cursor,
    });
    const url = `/me/gfycats` + query ? `?${query}` : '';
    const { data } = await this.httpClient.get<Gfycat.GfycatsResponse>(url);
    return data;
  };

  /**
   * Generates an "empty" gfyname (i.e. there will not be any media at that URL).
   */
  private getEmptyGfyname = async ({
    title,
    description,
    tags,
  }: {
    title?: string;
    description?: string;
    tags?: string[];
  }) => {
    const res = await this.httpClient.request<
      Gfycat.CreateGfycatRequest,
      AxiosResponse<Gfycat.EmptyGfycatResponse>
    >({
      method: 'POST',
      url: '/gfycats',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        title,
        description,
        tags,
        private: false,
        nsfw: 0,
        noMd5: 'true',
        keepAudio: true,
      },
    });
    return res.data.gfyname;
  };

  uploadFromUrl = async (
    url: string,
    title?: string,
    desc?: string,
    tags?: string[]
  ) => {
    const res = await this.httpClient.request<
      Gfycat.CreateGfycatRequest,
      AxiosResponse<unknown>
    >({
      method: 'POST',
      url: '/gfycats/',
      data: {
        fetchUrl: url,
        title: title,
        desc: desc,
        tags: tags,
        noMd5: 'true',
      },
    });
    return res.data;
  };

  uploadFromFile = async ({
    filepath,
    title,
    description,
    tags,
    isPrivate = false,
  }: {
    filepath: string;
    title?: string;
    description?: string;
    tags?: string[];
    isPrivate?: boolean;
  }) => {
    const name = await this.getEmptyGfyname({
      title,
      description,
      tags,
    });
    const buf = await fs.readFile(filepath);
    await this.httpClient.request<ArrayBufferLike, unknown>({
      method: 'PUT',
      url: `/${name}`,
      baseURL: 'https://filedrop.gfycat.com',
      data: buf.buffer,
      headers: { 'Content-Length': buf.byteLength },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    await this.pollGfycatStatus(name, 3 * 1000);

    /**
     * gfycat api requires creating the empty gfycat with
     * private set to `false` and then updating the visibility
     * after the gfycat file upload has completed. If you set
     * private to `true` while creating the empty gfycat, the
     * gfycat will always have "anonymous" as the uploader's username.
     */
    if (isPrivate) {
      await this.setVisibility({ gfyId: name, isPublished: false });
    }

    return name;
  };

  private pollGfycatStatus = async (name: string, pollIntervalMs: number) => {
    const poll = async () => {
      const { data } = await this.httpClient.get<Gfycat.GfycatStatusResponse>(
        `/gfycats/fetch/status/${name}`
      );
      if (data.task !== 'complete') {
        await sleep(pollIntervalMs);
        await poll();
      }
    };

    try {
      await poll();
    } catch (err) {
      if (err instanceof AxiosError && err.code === 'ECONNABORTED') {
        // request timed out
        console.log('polling request timed out');
      }
    }
  };

  setVisibility = async ({
    gfyId,
    isPublished,
  }: {
    gfyId: string;
    isPublished: boolean;
  }) => {
    await this.httpClient.put(`/me/gfycats/${gfyId}/published`, {
      value: Number(isPublished),
    });
  };

  getLikes = async (gfyId: string) => {
    const gfy = await this.getGfycatInfo(gfyId);
    return gfy.likes;
  };

  createCollection = async (input: Gfycat.MyCollectionInput) => {
    const { data } = await this.httpClient.post<Gfycat.MyCollectionResponse>(
      '/me/collections',
      input
    );
    return data;
  };

  deleteCollection = async (id: string) => {
    const { status } = await this.httpClient.delete(`/me/collections/${id}`);
    return status === 200;
  };

  updateCollection = async (
    id: string,
    options: { folderName?: string; tags?: string[]; published?: number }
  ) => {
    const { data } = await this.httpClient.patch<Gfycat.MyCollectionResponse>(
      `/me/collections/${id}`,
      options,
      {}
    );
    return data;
  };

  removeFromCollection = async (id: string, gfyIds: string[]) => {
    const { data } = await this.httpClient.request<
      string[],
      AxiosResponse<Gfycat.RemoveFromCollectionResponse>
    >({
      method: 'DELETE',
      url: `/me/collections/${id}/contents`,
      data: gfyIds,
    });
    return data;
  };

  getMyLikes = async ({
    count = 30,
    cursor,
  }: {
    count?: number;
    cursor?: string;
  }) => {
    const query = stringify({
      count,
      cursor,
    });
    const url = `/me/likes/populated` + query ? `?${query}` : '';
    const { data } = await this.httpClient.get<Gfycat.MyLikesResponse>(url);
    return data;
  };

  updateAccountInfo = async (options: Gfycat.UpdateAccountInfoRequest) => {
    const operations = [];
    if ('description' in options) {
      const isAdding = options.description !== undefined;
      operations.push({
        op: isAdding ? 'add' : 'remove',
        path: '/description',
        ...(isAdding ? { value: options.description } : undefined),
      });
    }
    if ('name' in options) {
      const isAdding = options.name !== undefined;
      operations.push({
        op: isAdding ? 'add' : 'remove',
        path: '/name',
        ...(isAdding ? { value: options.name } : undefined),
      });
    }
    if ('profileUrl' in options) {
      const isAdding = options.profileUrl !== undefined;
      operations.push({
        op: isAdding ? 'add' : 'remove',
        path: '/profileUrl',
        ...(isAdding ? { value: options.profileUrl } : undefined),
      });
    }
    if (!operations.length) {
      return;
    }
    await this.httpClient.patch('/me', {
      operations,
    });
  };
}