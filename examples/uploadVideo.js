const { GfycatClient } = require('../');

const main = async () => {
  const client = new GfycatClient({
    clientId: process.env.CLIENT_ID ?? '',
    clientSecret: process.env.CLIENT_SECRET ?? '',
    username: process.env.GFYCAT_USERNAME ?? '',
    password: process.env.GFYCAT_PASSWORD ?? '',
  });

  const gfyname = await client.uploadFromFile({
    filepath: 'examples/assets/video.mp4',
    title: 'Hello world!',
    description: 'This is my video.',
    isPrivate: true,
    tags: ['test'],
  });
  const info = await client.getGfycatInfo(gfyname);
  console.log(info);
};

main().catch((err) => console.error(err));
