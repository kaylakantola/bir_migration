const fetch = require('node-fetch');
global.fetch = fetch;
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;

const config = {
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
  PUBSUB_TOPIC: process.env.PUBSUB_TOPIC,
  DEFAULT_IMAGE: 'https://images.unsplash.com/photo-1565538917973-4079f5b64708?ixlib=rb-1.2.1&auto=format&fit=crop&w=948&q=80'
}

const unsplash = new Unsplash({accessKey: config.UNSPLASH_ACCESS_KEY});

const getBirdImage = (bird) => unsplash.search.photos(bird.name, 1, 1)
  .then(toJson)
  .then(({total, results}) => {
    const image = results.length>0 ? results[0].urls.regular : config.DEFAULT_IMAGE
    return image
  })

const publish = async (bird) => {
  const topic = config.PUBSUB_TOPIC
  console.log(`Publishing message to topic ${topic}`);
  const messageObject = {
    data: {
      message: bird,
    },
  };
  const messageBuffer = Buffer.from(JSON.stringify(messageObject), 'utf8');
  return await topic.publish(messageBuffer);
};

exports.liftoff = async (message, context) => {
  const bird = JSON.parse(Buffer.from(message.data, 'base64').toString())
  console.log("Liftoff!", bird.name)
  try {
    const image = await getBirdImage(bird.name)
    await publish({...bird, image})
    return console.log("Onward!", bird.name)
  } catch (err) {
    console.warn(err)
  }
};