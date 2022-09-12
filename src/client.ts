import debug from 'debug';
import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { promises as fs } from 'fs';
import * as Gfycat from './api.types';
import { sleep, isExpired, stringifyQueryParams } from './utils';

interface AuthToken {
  token: string;
  expiresAt: number;
}

export class GfycatClient {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly username: string;
  private readonly password: string;
  private readonly httpClient: Axios;
  private readonly log: debug.Debugger;
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
      validateStatus: (status) => status < 500,
    });

    this.log = debug('gfycat');

    this.httpClient.interceptors.request.use(async (config) => {
      this.log(
        [config.method?.toUpperCase(), config.url ?? config.baseURL]
          .filter(Boolean)
          .join(' | ')
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
      let data: string | undefined;
      try {
        data = JSON.stringify(config.data);
      } catch (err) {
        // ignore any TypeErrors thrown by JSON.stringify
      }
      this.log([config.status, data].filter(Boolean).join(' | '));
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
  private authenticate = async () => {
    const res = await this.httpClient.post<
      Gfycat.OauthTokenPasswordGrantRequest,
      AxiosResponse<Gfycat.OauthTokenPasswordGrantResponse>
    >('/oauth/token', {
      grant_type: 'password',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      username: this.username,
      password: this.password,
    });

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
   * returns a true if the user exists, false if user does not exist,
   * and null if the username is invalid
   * @see https://developers.gfycat.com/api/#checking-if-the-username-is-available-username-exists-username-is-valid
   */
  doesUserExist = async (username: string) => {
    const { status } = await this.httpClient.head(`/users/${username}`, {
      validateStatus: (status) => status < 500,
    });
    if (status === 404) {
      return false;
    }
    if (status >= 200 && status < 300) {
      return true;
    }
    return null;
  };

  /**
   * @see https://developers.gfycat.com/api/#checking-if-users-email-is-verified-or-not
   */
  isEmailVerified = async () => {
    const { status } = await this.httpClient.get('/me/email_verified', {
      validateStatus: (status) => status < 500,
    });
    return status !== 404;
  };

  /**
   * Sends an email requesting the user to verify their email address.
   * This sends an email regardless if the user's email is already verified. When the
   * user has already verified their email, the verify link in the email will take the
   * user to a page that says the link is invalid or has expired.
   * @see https://developers.gfycat.com/api/#sending-an-email-verification-request
   */
  sendEmailVerificationRequest = async () => {
    const { status } = await this.httpClient.post(
      '/me/send_verification_email',
      {},
      {
        validateStatus: (status) => status < 500,
      }
    );
    return status < 400;
  };

  /**
   * @see https://developers.gfycat.com/api/#send-a-password-reset-email
   */
  sendPasswordResetEmail = async (usernameOrEmail: string) => {
    const { status } = await this.httpClient.patch('/users', {
      value: usernameOrEmail,
      action: 'send_password_reset_email',
    });
    return status < 400;
  };

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
    count?: number;
    cursor?: string;
  }) => {
    const url = stringifyQueryParams({
      url: `/users/${userId}/gfycats`,
      params: {
        count,
        cursor,
      },
    });
    const { data } = await this.httpClient.get<Gfycat.GfycatsResponse>(url);
    return data;
  };

  getAllUserGfycats = async (userId: string) => {
    let gfycats: Gfycat.Gfycat[] = [];
    let cursor: string | undefined | null;
    while (cursor !== null) {
      const { gfycats: gfys, cursor: curs } = await this.getUserGfycats({
        userId,
        cursor,
      });
      if (gfys.length) {
        gfycats = gfycats.concat(gfys);
      }
      if (curs !== '' && curs) {
        cursor = curs;
      }
      if (!gfys.length || !curs) {
        cursor = null;
      }
    }
    return gfycats;
  };

  getAllMyGfycats = async () => {
    let gfycats: Gfycat.Gfycat[] = [];
    let cursor: string | undefined | null;
    while (cursor !== null) {
      const { gfycats: gfys, cursor: curs } = await this.getMyGfycats({
        cursor,
      });
      if (gfys.length) {
        gfycats = gfycats.concat(gfys);
      }
      if (curs !== '' && curs) {
        cursor = curs;
      }
      if (!gfys.length || !curs) {
        cursor = null;
      }
    }
    return gfycats;
  };

  getMyGfycats = async ({
    count = 30,
    cursor,
  }: {
    count?: number;
    cursor?: string;
  } = {}) => {
    const url = stringifyQueryParams({
      url: '/me/gfycats',
      params: {
        count,
        cursor,
      },
    });
    const { data } = await this.httpClient.get<Gfycat.GfycatsResponse>(url);
    return data;
  };

  searchMyGfycats = async (searchText: string) => {
    let gfycats: Gfycat.Gfycat[] = [];
    let related: Gfycat.Gfycat[] = [];
    let cursor: string | undefined | null;
    let found = 0;
    while (cursor !== null) {
      const url = stringifyQueryParams({
        url: '/me/gfycats',
        params: {
          search_text: searchText,
          count: 100,
          cursor,
        },
      });
      const { status, data } = await this.httpClient.get<{
        cursor: string | null;
        gfycats: Gfycat.Gfycat[];
        related: Gfycat.Gfycat[];
        found: number;
      }>(url);
      if (status >= 400) {
        break;
      }
      const {
        gfycats: gfys,
        cursor: curs,
        related: relatedGfys,
        found: f,
      } = data;
      found = f;
      if (gfys.length) {
        gfycats = gfycats.concat(gfys);
      }
      if (relatedGfys.length) {
        related = related.concat(relatedGfys);
      }
      if (curs !== '' && curs) {
        cursor = curs;
      }
      if (!gfys.length || !curs) {
        cursor = null;
      }
    }
    return { gfycats, related, found };
  };

  /**
   * Register an empty gfyname that can later have media associated with it
   */
  private getEmptyGfyname = async ({
    title,
    description,
    tags,
    keepAudio = true,
    nsfw = 0,
  }: {
    title?: string;
    description?: string;
    tags?: string[];
    keepAudio?: boolean;
    nsfw?: Gfycat.NsfwCode;
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
        nsfw,
        noMd5: 'true',
        keepAudio,
      },
    });
    return res.data.gfyname;
  };

  uploadFromUrl = async (
    url: string,
    title?: string,
    description?: string,
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
        desc: description,
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

    /**
     * gfycat api requires creating the empty gfycat with
     * private set to `false` and then updating the visibility
     * after the gfycat file upload has completed. If you set
     * private to `true` while creating the empty gfycat, the
     * gfycat will always have "anonymous" as the uploader's username.
     */
    if (isPrivate) {
      await this.pollGfycatStatus(name, 3 * 1000);
      await this.setVisibility({ gfyId: name, isPublished: false });
    }

    return name;
  };

  pollGfycatStatus = async (name: string, pollIntervalMs: number) => {
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
        this.log(`status polling request timed out for gfyId ${name}`);
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
    const { status } = await this.httpClient.put(
      `/me/gfycats/${gfyId}/published`,
      {
        value: Number(isPublished),
      },
      { validateStatus: (status) => status < 500 }
    );
    return status < 400;
  };

  getLikes = async (gfyId: string) => {
    const gfy = await this.getGfycatInfo(gfyId);
    return gfy.likes;
  };

  /**
   * Omit `title` or set `title` to `undefined` to remove the title
   * from the Gfycat
   */
  updateGfycatTitle = async ({
    gfyId,
    title,
  }: {
    gfyId: string;
    title?: string;
  }) => {
    const url = `/me/gfycats/${gfyId}/title`;
    if (title) {
      const { status } = await this.httpClient.put(url, {
        value: title,
      });
      return status < 400;
    }
    const { status } = await this.httpClient.delete(url);
    return status < 400;
  };

  updateGfycatDescription = async ({
    gfyId,
    description,
  }: {
    gfyId: string;
    description?: string;
  }) => {
    const url = `/me/gfycats/${gfyId}/description`;
    if (description) {
      const { status } = await this.httpClient.put(url, { value: description });
      return status < 400;
    }
    const { status } = await this.httpClient.delete(url);
    return status < 400;
  };

  /**
   * "Like" or remove your "like" from your own Gfycat
   */
  updateMyGfycatLike = async ({
    gfyId,
    like,
  }: {
    gfyId: string;
    like: boolean;
  }) => {
    const { status } = await this.httpClient.put(`/me/gfycats/${gfyId}/like`, {
      value: like ? '1' : '0',
    });
    return status < 400;
  };

  /**
   * Update/replace gfycat tags (20 tags maximum)
   */
  updateGfycatTags = async ({
    gfyId,
    tags,
  }: {
    gfyId: string;
    tags: string[];
  }) => {
    const { status } = await this.httpClient.put(`/me/gfycats/${gfyId}/tags`, {
      value: tags,
    });
    return status < 400;
  };

  getGfycatDomainWhitelist = (_gfyId: string) => {
    throw new Error('Not implemented');
  };

  updateGfycatDomainWhitelist = (_opts: {
    gfyId: string;
    domainWhitelist?: string[];
  }) => {
    throw new Error('Not implemented');
  };

  updateGfycatNsfwStatus = async ({
    gfyId,
    nsfw,
  }: {
    gfyId: string;
    nsfw: 0 | 1 | 3;
  }) => {
    const { status } = await this.httpClient.put(`/me/gfycats/${gfyId}/nsfw`, {
      value: `${nsfw}`,
    });
    return status < 400;
  };

  deleteGfycat = async (gfyId: string) => {
    const { status } = await this.httpClient.delete(`/me/gfycats/${gfyId}`);
    return status < 400;
  };

  getUserCollections = async ({
    username,
    count = 30,
    cursor,
  }: {
    username: string;
    count?: number;
    cursor?: string;
  }) => {
    const url = stringifyQueryParams({
      url: `/users/${username}/collections`,
      params: {
        count,
        cursor,
      },
    });
    const { data } = await this.httpClient.get<Gfycat.UserCollectionsResponse>(
      url
    );
    return data;
  };

  getUserCollectionGfycats = async ({
    username,
    collectionId,
    count = 30,
    cursor,
  }: {
    username: string;
    collectionId: string;
    count?: number;
    cursor?: string;
  }) => {
    const url = stringifyQueryParams({
      url: `/users/${username}/collections/${collectionId}/gfycats`,
      params: {
        count,
        cursor,
      },
    });
    const { data } =
      await this.httpClient.get<Gfycat.CollectionGfycatsResponse>(url);
    return data;
  };

  getMyCollections = async ({
    count = 30,
    cursor,
  }: {
    count?: number;
    cursor?: string;
  } = {}) => {
    const url = stringifyQueryParams({
      url: '/me/collections',
      params: {
        count,
        cursor,
      },
    });
    const { data } = await this.httpClient.get<Gfycat.UserCollectionsResponse>(
      url
    );
    return data;
  };

  getAllMyCollections = async () => {
    let collections: Gfycat.GfycatCollection[] = [];
    let cursor: string | undefined | null;
    while (cursor !== null) {
      const { gfyCollections, cursor: curs } = await this.getMyCollections({
        cursor,
      });
      if (gfyCollections.length) {
        collections = collections.concat(gfyCollections);
      }
      if (curs !== '' && curs) {
        cursor = curs;
      }
      if (!gfyCollections.length || !curs) {
        cursor = null;
      }
    }
    return collections;
  };

  getMyCollectionGfycats = async ({
    collectionId,
    count = 30,
    cursor,
  }: {
    collectionId: string;
    count?: number;
    cursor?: string;
  }) => {
    const url = stringifyQueryParams({
      url: `/me/collections/${collectionId}/gfycats`,
      params: {
        count,
        cursor,
      },
    });
    const { data } =
      await this.httpClient.get<Gfycat.CollectionGfycatsResponse>(url);
    return data;
  };

  getAllMyCollectionGfycats = async (collectionId: string) => {
    let gfycats: Gfycat.Gfycat[] = [];
    let cursor: string | undefined | null;
    while (cursor !== null) {
      const { gfycats: gfys, cursor: curs } = await this.getMyCollectionGfycats(
        {
          collectionId,
          cursor,
        }
      );
      if (gfys.length) {
        gfycats = gfycats.concat(gfys);
      }
      if (curs !== '' && curs) {
        cursor = curs;
      }
      if (!gfys.length || !curs) {
        cursor = null;
      }
    }
    return gfycats;
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
    options: {
      folderName?: string;
      tags?: string[];
      published?: Gfycat.PublishedStatus;
    }
  ) => {
    const { data } = await this.httpClient.patch<Gfycat.MyCollectionResponse>(
      `/me/collections/${id}`,
      options,
      {}
    );
    return data;
  };

  updateCollectionGfycats = async ({
    collectionId,
    gfycatIds,
  }: {
    collectionId: string;
    gfycatIds: string[];
  }) => {
    const { data } =
      await this.httpClient.post<Gfycat.AddToMyCollectionResponse>(
        `/me/collections/${collectionId}/contents`,
        gfycatIds
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

  getSavedGfycats = async ({
    count = 30,
    cursor,
  }: {
    count?: number;
    cursor?: string;
  }) => {
    const url = stringifyQueryParams({
      url: '/me/collections/saved/gfycats',
      params: {
        count,
        cursor,
      },
    });
    const { data } = await this.httpClient.get<{
      count: number;
      cursor: string | null;
      gfycats: Gfycat.Gfycat[];
      status: 'ok' | string;
      totalCount: number;
    }>(url);
    return data;
  };

  getAllSavedGfycats = async () => {
    let gfycats: Gfycat.Gfycat[] = [];
    let cursor: string | undefined | null;
    while (cursor !== null) {
      const { gfycats: gfys, cursor: curs } = await this.getSavedGfycats({
        cursor,
      });
      if (gfys.length) {
        gfycats = gfycats.concat(gfys);
      }
      if (curs !== '' && curs) {
        cursor = curs;
      }
      if (!gfys.length || !curs) {
        cursor = null;
      }
    }
    return gfycats;
  };

  getMyLikes = async ({
    count = 30,
    cursor,
  }: {
    count?: number;
    cursor?: string;
  }) => {
    const url = stringifyQueryParams({
      url: '/me/likes/populated',
      params: {
        count,
        cursor,
      },
    });
    const { data } = await this.httpClient.get<Gfycat.MyLikesResponse>(url);
    return data;
  };

  getAllMyLikes = async () => {
    let gfycats: Gfycat.Gfycat[] = [];
    let cursor: string | undefined | null;
    while (cursor !== null) {
      const data = await this.getMyLikes({
        cursor,
      });
      if ('errorMessage' in data) {
        return {
          gfycats,
          errorMessage: data.errorMessage,
        };
      }
      const { gfycats: gfys, cursor: curs } = data;
      if (gfys.length) {
        gfycats = gfycats.concat(gfys);
      }
      if (curs !== '' && curs) {
        cursor = curs;
      }
      if (!gfys.length || !curs) {
        cursor = null;
      }
    }
    return { gfycats };
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
    const res = await this.httpClient.patch('/me', {
      operations,
    });
    return res.status < 400;
  };
}
