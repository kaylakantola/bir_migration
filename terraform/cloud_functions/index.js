const fetch = require('node-fetch');
global.fetch = fetch;
const {PubSub} = require('@google-cloud/pubsub');
const Unsplash = require('unsplash-js').default;
const toJson = require('unsplash-js').toJson;

const config = {
  PROJECT_ID: process.env.PROJECT_ID,
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
  const pubSubClient = new PubSub({projectId: config.PROJECT_ID});
  const dataBuffer = Buffer.from(JSON.stringify(bird));
  const messageId = await pubSubClient.topic(config.PUBSUB_TOPIC).publish(dataBuffer);
  return messageId
};

exports.liftoff = async (message, context) => {
  const bird = JSON.parse(Buffer.from(message.data, 'base64').toString())
  console.log("Liftoff! Bird: ", bird.name, bird.uuid)
  try {
    const image = await getBirdImage(bird.name)
    const enriched_bird = {...bird, image, air_quality: []}
    const messageId = await publish(enriched_bird)
    return console.log("Onward! Bird: ", {messageId, enriched_bird})
  } catch (err) {
    console.warn(err)
  }
};