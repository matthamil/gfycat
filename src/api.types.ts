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

export type LanguageCategory = 'trending' | string;

export type PublishedStatus = 0 | 1;
export type NsfwCode = 0 | 1 | 3;

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

export interface TimelineFeedResponse {
  gfycats: Gfycat[];
  count: number;
  totalCount: number;
  cursor: string;
  status: string;
}

export interface SearchByTagGfycatsResponse {
  cursor: string;
  gfycats: Gfycat[];
  tag: string;
  tagText: string;
}

export interface CuratedTrendingGfycatsResponse
  extends SearchByTagGfycatsResponse {
  tag: 'trending';
  tagText: 'trending';
}

export interface TrendingGfycatsResponse {
  gfycats: Gfycat[];
  cursor: string;
  found: number;
}

export interface SearchGfycatsResponse {
  gfycats: Gfycat[];
  cursor: string;
  found: number;
}

export interface GfycatCollection {
  contentCount: number;
  createDate: number;
  folderId: string;
  folderName: string;
  folderSubType: 'Album' | string;
  linkText: string;
  nsfw: NsfwCode;
  parentId: string;
  posterGfycat: Gfycat;
  published: PublishedStatus;
  userId: string;
}

export interface GfycatBookmarkCollection {
  contentCount: number;
  folderId: 'saved';
  folderName: 'bookmarks';
  userId: string;
}

export interface UserCollectionsResponse {
  count: number;
  cursor: string;
  gfyBookmarkCollection: GfycatBookmarkCollection;
  gfyCollections: GfycatCollection[];
  status: 'ok' | string;
  totalCount: number;
}

export interface CollectionGfycatsResponse {
  count: number;
  status: 'ok' | string;
  totalCount: number;
  cursor: string;
  gfycats: Gfycat[];
}

export interface AddToMyCollectionResponse {
  status: 'ok' | string;
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

interface ErrorResponse {
  errorMessage: string;
}

export type UserDetailsResponse =
  | {
      createDate: number;
      followers: number;
      following: number;
      iframeProfileImageVisible: boolean;
      name: string;
      profileImageUrl?: string;
      publishedAlbums: number;
      publishedGfycats: number;
      subscription: number;
      url: string;
      userid: string;
      username: string;
      verified: boolean;
      views: number;
    }
  | ErrorResponse;

export interface AuthenticatedUserResponse {
  canonicalUsername: string;
  consentAge: number;
  consentTermsPrivacy: number;
  createDate: number;
  email: string;
  emailVerified: boolean;
  followers: number;
  following: number;
  iframeProfileImageVisible: boolean;
  name: string;
  publishedAlbums: number;
  publishedGfycats: number;
  subscription: number;
  totalAlbums: number;
  totalBookmarks: number;
  totalGfycats: number;
  url: string;
  userid: string;
  username: string;
  verified: boolean;
  viewingPreference: number;
  views: number;
}

export interface UpdateUserDetailsOperation {
  op: 'add' | 'remove' | 'replace';
  path: string;
  value?: string | string[] | boolean;
}

export interface PaginatedAllFollowingResponse {
  follows: FollowingUser[];
  count: number;
  totalCount: number;
  cursor: string;
  status: string;
}

export interface PaginatedAllFollowersResponse {
  followers: FollowingUser[];
  count: number;
  totalCount: number;
  cursor: string;
  status: string;
}

export interface FollowingUser {
  user_id: string;
  follower_id: string;
  follow_date: number;
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

export interface CutOptions {
  duration: number;
  start: number;
}

export interface CropOptions {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CreateGfycatRequest {
  fetchUrl?: string;
  title?: string;
  description?: string;
  tags?: string[];
  noMd5?: 'true' | 'false';
  private?: PublishedStatus;
  nsfw?: NsfwCode;
  fetchSeconds?: number;
  fetchMinutes?: number;
  fetchHours?: number;
  captions?: GfycatCaption[];
  cut?: CutOptions;
  crop?: CropOptions;
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
  published: PublishedStatus;
  userId: string;
}

export interface MyCollectionInput {
  folderName: string;
  tags?: string[];
  description?: string;
  published: PublishedStatus;
  gfyIds?: string[];
}

export interface MyCollectionResponse {
  gfyCollection: GfyCollection;
  status: 'ok' | string;
}

export interface EditCollectionInput {
  folderName: string;
  tags?: string[];
  published?: PublishedStatus;
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
  | ErrorResponse;

export interface UpdateAccountInfoRequest {
  profileUrl?: string;
  name?: string;
  description?: string;
}
