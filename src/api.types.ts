export type LanguageCategory = 'trending' | string;

export type NsfwCode = 0 | 1 | 3;

export interface Gfycat {
  avgColor: string;
  content_urls: GfyContentUrls;
  createDate: number;
  description: string;
  frameRate: number;
  gatekeeper: number;
  gfyId: string;
  gfyName: string;
  gfyNumber: number;
  gfySlug: string;
  gif100px: string;
  gifUrl: string;
  hasAudio: boolean;
  hasTransparency: boolean;
  height: number;
  languageCategories: LanguageCategory[] | null;
  likes: number;
  max1mbGif: string;
  max2mbGif: string;
  max5mbGif: string;
  md5: string;
  miniPosterUrl: string;
  miniUrl: string;
  mobilePosterUrl: string;
  mobileUrl: string;
  mp4Size: number;
  mp4Url: string;
  nsfw: NsfwCode;
  numFrames: number;
  posterUrl: string;
  published: number;
  tags: string[] | null;
  thumb100PosterUrl: string;
  title: string;
  userData: UserData;
  username: string;
  views: number;
  webmSize: number;
  webmUrl: string;
  webpUrl: string;
  width: number;
  isSticker: boolean;
}

export interface GfyContentUrl {
  url: string;
  size: number;
  width: number;
  height: number;
}

export interface GfyContentUrls {
  '100pxGif': GfyContentUrl;
  largeGif: GfyContentUrl;
  max1mbGif: GfyContentUrl;
  max2mbGif: GfyContentUrl;
  max5mbGif: GfyContentUrl;
  mobile: GfyContentUrl;
  mobilePoster: GfyContentUrl;
  mp4: GfyContentUrl;
  webm: GfyContentUrl;
  webp: GfyContentUrl;
}

export interface UserData {
  followers: number;
  following: number;
  subscription: number;
  username: string;
  verified: boolean;
  views: number;
}

export interface GfycatsResponse {
  cursor: string;
  gfycats: Gfycat[];
}

export interface GfycatResponse {
  gfyItem: Gfycat;
}

export interface OauthTokenClientCredentialsRequest {
  grant_type: 'client_credentials';
  client_id: string;
  client_secret: string;
}

export interface OauthTokenClientCredentialsResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: 'bearer';
}

export interface OauthTokenPasswordGrantRequest {
  grant_type: 'password';
  client_id: string;
  client_secret: string;
  username: string;
  password: string;
}

export interface OauthTokenPasswordGrantResponse {
  token_type: 'bearer';
  refresh_token_expires_in: number;
  refresh_token: string;
  scope: string;
  resource_owner: string;
  expires_in: number;
  access_token: string;
}

export interface RefreshAccessTokenRequest {
  grant_type: 'refresh';
  client_id: string;
  client_secret: string;
  refresh_token: string;
}

export interface EmptyGfycatResponse {
  gfyname: string;
}

export interface GfycatCaption {
  text: string;
  startSeconds?: number;
  duration?: number;
  fontHeight?: number;
  x?: number;
  y?: number;
  fontHeightRelative?: number;
  xRelative?: number;
  yRelative?: number;
}

export interface CreateGfycatRequest {
  fetchUrl?: string;
  title?: string;
  description?: string;
  tags?: string[];
  noMd5?: 'true' | 'false';
  private?: 0 | 1;
  nsfw?: NsfwCode;
  fetchSeconds?: number;
  fetchMinutes?: number;
  fetchHours?: number;
  captions?: GfycatCaption[];
  cut?: {
    duration: number;
    start: number;
  };
  crop?: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export type GfycatStatusResponse =
  | {
      task: 'encoding';
      time: number;
      progress: string;
    }
  | {
      task: 'complete';
      gfyname: string;
    }
  | {
      task: 'NotFoundo';
      time: number;
    }
  | {
      task: 'error';
      errorMeessage: {
        code: string;
        description: string;
      };
    };

export interface GfyCollection {
  createDate: number;
  folderId: string;
  folderName: string;
  folderSubType: string;
  linkText: string;
  nsfw: NsfwCode;
  parentId: string;
  published: 0 | 1;
  userId: string;
}

export interface MyCollectionInput {
  folderName: string;
  tags?: string[];
  description?: string;
  published: 0 | 1;
  gfyIds?: string[];
}

export interface MyCollectionResponse {
  gfyCollection: GfyCollection;
  status: 'ok' | string;
}

export interface EditCollectionInput {
  folderName: string;
  tags?: string[];
  published?: 0 | 1;
}

export type RemoveFromCollectionInput = string[];

export interface RemoveFromCollectionResponse {
  status: 'ok' | string;
}

export type MyLikesResponse =
  | {
      gfycats: Gfycat[];
      count: number;
      totalCount: number;
      cursor: string;
      status: string;
    }
  | { errorMessage: string };

export interface UpdateAccountInfoRequest {
  profileUrl?: string;
  name?: string;
  description?: string;
}