import { v4 as uuid } from 'uuid';
import { GfycatClient } from '../src';
import { sleep } from '../src/utils';

const USERNAME = process.env.GFYCAT_USERNAME!;
const READONLY_TEST_GFYCAT = 'aptfreegeese';
const TEST_COLLECTION_ID = '1rctCdk4';

const createClient = () => {
  const clientId = process.env.GFYCAT_CLIENT_ID;
  if (!clientId) {
    throw new Error('Missing environment variable GFYCAT_CLIENT_ID');
  }
  const clientSecret = process.env.GFYCAT_CLIENT_SECRET;
  if (!clientSecret) {
    throw new Error('Missing environment variable GFYCAT_CLIENT_SECRET');
  }
  const username = process.env.GFYCAT_USERNAME;
  if (!username) {
    throw new Error('Missing environment variable GFYCAT_USERNAME');
  }
  const password = process.env.GFYCAT_PASSWORD;
  if (!password) {
    throw new Error('Missing environment variable GFYCAT_PASSWORD');
  }
  return new GfycatClient({
    clientId,
    clientSecret,
    username,
    password,
  });
};

const createCollectionId = () => `Test ${uuid()}`;

describe('GfycatClient', () => {
  it('should fetch details about a gfycat', async () => {
    const client = createClient();
    const gfycat = await client.getGfycatInfo(READONLY_TEST_GFYCAT);

    expect(gfycat.avgColor).toBe('#FDFDFD');
    expect(gfycat.content_urls).toMatchObject({
      '100pxGif': {
        url: 'https://thumbs.gfycat.com/AptFreeGeese-max-1mb.gif',
        size: 60493,
        width: 992,
        height: 1006,
      },
      largeGif: {
        url: 'https://thumbs.gfycat.com/AptFreeGeese-size_restricted.gif',
        size: 60493,
        width: 992,
        height: 1006,
      },
      max1mbGif: {
        url: 'https://thumbs.gfycat.com/AptFreeGeese-max-1mb.gif',
        size: 60493,
        width: 992,
        height: 1006,
      },
      max2mbGif: {
        url: 'https://thumbs.gfycat.com/AptFreeGeese-small.gif',
        size: 60493,
        width: 992,
        height: 1006,
      },
      max5mbGif: {
        url: 'https://thumbs.gfycat.com/AptFreeGeese-size_restricted.gif',
        size: 60493,
        width: 992,
        height: 1006,
      },
      mobile: {
        url: 'https://thumbs.gfycat.com/AptFreeGeese-mobile.mp4',
        size: 8330,
        width: 640,
        height: 650,
      },
      mobilePoster: {
        url: 'https://thumbs.gfycat.com/AptFreeGeese-mobile.jpg',
        size: 11062,
        width: 640,
        height: 650,
      },
      mp4: {
        url: 'https://giant.gfycat.com/AptFreeGeese.mp4',
        size: 11413,
        width: 992,
        height: 1006,
      },
      webm: {
        url: 'https://giant.gfycat.com/AptFreeGeese.webm',
        size: 26084,
        width: 992,
        height: 1006,
      },
      webp: {
        url: 'https://thumbs.gfycat.com/AptFreeGeese.webp',
        size: 15368,
        width: 520,
        height: 527,
      },
    });
    expect(gfycat.createDate).toBe(1651644717);
    expect(gfycat.description).toBe('');
    expect(gfycat.frameRate).toBe(20);
    expect(gfycat.gatekeeper).toBe(5);
    expect(gfycat.gfyId).toBe(READONLY_TEST_GFYCAT);
    expect(gfycat.gfyName).toBe('AptFreeGeese');
    expect(gfycat.gfyNumber).toBe(905965671);
    expect(gfycat.gfySlug).toBe('');
    expect(gfycat.gif100px).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-max-1mb.gif'
    );
    expect(gfycat.gifUrl).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-size_restricted.gif'
    );
    expect(gfycat.hasAudio).toBe(false);
    expect(gfycat.hasTransparency).toBe(false);
    expect(gfycat.height).toBe(1006);
    expect(gfycat.languageCategories).toMatchObject([]);
    expect(gfycat.likes).toBeGreaterThanOrEqual(0);
    expect(gfycat.max1mbGif).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-max-1mb.gif'
    );
    expect(gfycat.max2mbGif).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-small.gif'
    );
    expect(gfycat.max5mbGif).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-size_restricted.gif'
    );
    expect(gfycat.md5).toBe('5fa766ee704df18a1a3c877eafa5da63');
    expect(gfycat.miniPosterUrl).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-mobile.jpg'
    );
    expect(gfycat.miniUrl).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-mobile.mp4'
    );
    expect(gfycat.mobilePosterUrl).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-mobile.jpg'
    );
    expect(gfycat.mobileUrl).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-mobile.mp4'
    );
    expect(gfycat.mp4Size).toBe(11413);
    expect(gfycat.mp4Url).toBe('https://giant.gfycat.com/AptFreeGeese.mp4');
    expect(gfycat.nsfw).toBe(0);
    expect(gfycat.numFrames).toBe(3);
    expect(gfycat.posterUrl).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-poster.jpg'
    );
    expect(gfycat.published).toBe(1), expect(gfycat.tags).toMatchObject([]);
    expect(gfycat.thumb100PosterUrl).toBe(
      'https://thumbs.gfycat.com/AptFreeGeese-mobile.jpg'
    );
    expect(gfycat.title).toBe('who');
    expect(gfycat.userData.followers).toBeGreaterThanOrEqual(0);
    expect(gfycat.userData.following).toBeGreaterThanOrEqual(0);
    expect(typeof gfycat.userData.verified).toBe('boolean');
    expect(gfycat.userData.subscription).toBeGreaterThanOrEqual(0);
    expect(gfycat.userData.username).toBe(USERNAME);
    expect(gfycat.userData.views).toBeGreaterThanOrEqual(0);
    expect(gfycat.username).toBe(USERNAME);
    expect(gfycat.views).toBeGreaterThan(0);
    expect(gfycat.webmSize).toBe(26084);
    expect(gfycat.webmUrl).toBe('https://giant.gfycat.com/AptFreeGeese.webm');
    expect(gfycat.webpUrl).toBe('https://thumbs.gfycat.com/AptFreeGeese.webp');
    expect(gfycat.width).toBe(992);
    expect(gfycat.isSticker).toBe(false);
  });

  it('should return true for a user that exists', async () => {
    const client = createClient();
    const result = await client.doesUserExist(USERNAME);
    expect(result).toBe(true);
  });

  it('should return false for a user that does not exist', async () => {
    const client = createClient();
    const result = await client.doesUserExist(
      'abc 123 ___ --- !!! @@@ ... !@#$%^ abc 123 ___'
    );
    expect(result).toBe(false);
  });

  it('should return true when the user has a verified email', async () => {
    const client = createClient();
    const result = await client.isEmailVerified();
    expect(result).toBe(true);
  });

  it('should get the gfycats associated with the given user', async () => {
    const client = createClient();
    const result = await client.getUserGfycats({
      userId: USERNAME,
    });
    expect(result).toHaveProperty('cursor');
    expect(result.gfycats.length).toBeGreaterThanOrEqual(0);
  });

  it('should get the gfycats for the authenticated user', async () => {
    const client = createClient();
    const result = await client.getMyGfycats();
    expect(result).toHaveProperty('cursor');
    expect(result.gfycats.length).toBeGreaterThanOrEqual(0);
  });

  it('should allow the visibility of a gfycat to be changed', async () => {
    const VISIBILITY_TEST_GFYCAT_ID = 'annualplainalabamamapturtle';
    const client = createClient();

    const didUnpublish = await client.setVisibility({
      gfyId: VISIBILITY_TEST_GFYCAT_ID,
      isPublished: false,
    });

    const waitUntilUnpublished = async (retryCount = 0) => {
      if (retryCount === 3) {
        throw new Error();
      }
      const unpublishedGfycat = await client.getGfycatInfo(
        VISIBILITY_TEST_GFYCAT_ID
      );
      if (unpublishedGfycat.published !== 0) {
        await sleep(3 * 1000);
        await waitUntilUnpublished(retryCount + 1);
      } else {
        expect(unpublishedGfycat.published).toBe(0);
        expect(didUnpublish).toBe(true);
      }
    };

    await waitUntilUnpublished();

    const didPublish = await client.setVisibility({
      gfyId: VISIBILITY_TEST_GFYCAT_ID,
      isPublished: true,
    });

    const waitUntilPublished = async (retryCount = 0) => {
      if (retryCount === 3) {
        throw new Error();
      }
      const publishedGfycat = await client.getGfycatInfo(
        VISIBILITY_TEST_GFYCAT_ID
      );
      if (publishedGfycat.published !== 1) {
        await sleep(3 * 1000);
        await waitUntilUnpublished(retryCount + 1);
      } else {
        expect(publishedGfycat.published).toBe(1);
        expect(didPublish).toBe(true);
      }
    };

    await waitUntilPublished();
  });

  it('should get the number of likes for a given gfycat', async () => {
    const client = createClient();
    const likes = await client.getLikes(READONLY_TEST_GFYCAT);
    expect(likes).toBeGreaterThanOrEqual(0);
  });

  it('should get the collections for a given user', async () => {
    const client = createClient();
    const collections = await client.getUserCollections({
      username: USERNAME,
    });
    expect(collections).toHaveProperty('cursor');
    expect(collections).toHaveProperty('status');
    expect(collections.count).toBeGreaterThanOrEqual(0);
    expect(collections).toHaveProperty('gfyBookmarkCollection');
    expect(collections.gfyCollections.length).toBeGreaterThanOrEqual(0);
    expect(collections.totalCount).toBeGreaterThanOrEqual(0);
  });

  it("should get the gfycats in a given user's collection", async () => {
    const client = createClient();
    const collections = await client.getUserCollectionGfycats({
      username: USERNAME,
      collectionId: TEST_COLLECTION_ID,
    });
    expect(collections).toHaveProperty('cursor');
    expect(collections).toHaveProperty('status');
    expect(collections.count).toBeGreaterThanOrEqual(0);
    expect(collections.totalCount).toBeGreaterThanOrEqual(0);
    expect(collections.gfycats.length).toBeGreaterThanOrEqual(1);
    expect(
      collections.gfycats.some(
        (gfycat) => gfycat.gfyId === READONLY_TEST_GFYCAT
      )
    ).toBe(true);
  });

  it("should get the gfycats in the authenticated user's collection", async () => {
    const client = createClient();
    const collections = await client.getMyCollectionGfycats({
      collectionId: TEST_COLLECTION_ID,
    });
    expect(collections).toHaveProperty('cursor');
    expect(collections).toHaveProperty('status');
    expect(collections.count).toBeGreaterThanOrEqual(0);
    expect(collections.totalCount).toBeGreaterThanOrEqual(0);
    expect(collections.gfycats.length).toBeGreaterThanOrEqual(1);
    expect(
      collections.gfycats.some(
        (gfycat) => gfycat.gfyId === READONLY_TEST_GFYCAT
      )
    ).toBe(true);
  });

  it('should create a collection', async () => {
    const client = createClient();
    const collectionId = createCollectionId();
    const result = await client.createCollection({
      folderName: collectionId,
      published: 1,
      gfyIds: [READONLY_TEST_GFYCAT],
    });
    expect(result.gfyCollection.folderName).toBe(collectionId);
    expect(result.gfyCollection.published).toBe(1);
  });

  it('should update a collection', async () => {
    const client = createClient();
    const collectionId = createCollectionId() + ' update me!';
    const res = await client.createCollection({
      folderName: collectionId,
      published: 1,
      gfyIds: [READONLY_TEST_GFYCAT],
    });

    const updatedName = res.gfyCollection.folderName.replace(
      'update me!',
      'i was updated!'
    );
    const updatedPublishedStatus = 0;

    const updatedRes = await client.updateCollection(
      res.gfyCollection.folderId,
      { folderName: updatedName, published: updatedPublishedStatus }
    );

    expect(updatedRes.gfyCollection.folderName).toBe(updatedName);
    expect(updatedRes.gfyCollection.published).toBe(updatedPublishedStatus);
    expect(updatedRes.gfyCollection.folderId).toBe(res.gfyCollection.folderId);
  });

  it('should delete a collection', async () => {
    const client = createClient();
    const collectionId = createCollectionId() + ' delete me!';
    const res = await client.createCollection({
      folderName: collectionId,
      published: 1,
      gfyIds: [READONLY_TEST_GFYCAT],
    });
    const didDelete = await client.deleteCollection(res.gfyCollection.folderId);
    expect(didDelete).toBe(true);
  });

  it('should remove a gfycat from a collection', async () => {
    const client = createClient();
    const collectionId = createCollectionId();
    const res = await client.createCollection({
      folderName: collectionId,
      published: 1,
      gfyIds: [READONLY_TEST_GFYCAT],
    });

    const beforeCollectionGfycats = await client.getUserCollectionGfycats({
      username: USERNAME,
      collectionId: res.gfyCollection.folderId,
    });
    expect(
      beforeCollectionGfycats.gfycats.find(
        (gfycat) => gfycat.gfyId === READONLY_TEST_GFYCAT
      )
    ).toBeTruthy();

    await client.removeFromCollection(res.gfyCollection.folderId, [
      READONLY_TEST_GFYCAT,
    ]);

    const afterCollectionGfycats = await client.getUserCollectionGfycats({
      username: USERNAME,
      collectionId: res.gfyCollection.folderId,
    });

    expect(
      afterCollectionGfycats.gfycats.find(
        (gfycat) => gfycat.gfyId === READONLY_TEST_GFYCAT
      )
    ).toBeFalsy();
  });
});
