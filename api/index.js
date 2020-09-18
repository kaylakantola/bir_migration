const { v4: uuidv4 } = require('uuid');
const {PubSub} = require('@google-cloud/pubsub');
require('dotenv').config()
const express = require('express')
const app = express()

const config = {
  PORT: 3000,
  PROJECT_ID: process.env.PROJECT_ID,
  PUBSUB_TOPIC: process.env.PUBSUB_TOPIC
}

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/bird', async (req, res) => {
  const bird = req.body
  const uuid = uuidv4()
  const start_time = Date.now()
  const enriched_bird = {...bird, uuid, start_time}
  const pubSubClient = new PubSub({projectId: config.PROJECT_ID});
  const dataBuffer = Buffer.from(JSON.stringify(enriched_bird));
  const messageId = await pubSubClient.topic(config.PUBSUB_TOPIC).publish(dataBuffer);
  res.send({...enriched_bird, messageId})
})


app.listen(config.PORT, () => {
  console.log(`Example app listening at http://localhost:${config.PORT}`)
})