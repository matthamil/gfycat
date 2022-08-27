import { GfycatClient } from '../src';

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

describe('GfycatClient', () => {
  it('should fetch details about a gfycat', async () => {
    const client = createClient();
    const gfycat = await client.getGfycatInfo('aptfreegeese');

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
    expect(gfycat.gfyId).toBe('aptfreegeese');
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
    expect(gfycat.userData.username).toBe('heymatt');
    expect(gfycat.userData.views).toBeGreaterThanOrEqual(0);
    expect(gfycat.username).toBe('heymatt');
    expect(gfycat.views).toBeGreaterThan(0);
    expect(gfycat.webmSize).toBe(26084);
    expect(gfycat.webmUrl).toBe('https://giant.gfycat.com/AptFreeGeese.webm');
    expect(gfycat.webpUrl).toBe('https://thumbs.gfycat.com/AptFreeGeese.webp');
    expect(gfycat.width).toBe(992);
    expect(gfycat.isSticker).toBe(false);
  });
});
