# Bird Migration

![chickadee](./images/intense.png)

An example repo showing how to:
- Write terraform for GCP resources, specifically:
    - Pubsub 
    - Storage 
    - Cloud Functions
    - Dataflow (WIP)
- Writing a cloud function that is:
    - Triggered by a pub sub
    - Makes an API call to enrich the incoming data (a JSON object representing a bird) with an image from unsplash
    - Publishes the enriched data to a different pubsub topic
    
WIP: 
- Writing Apache Beam pipelines to:
    - Stream unbounded data sets
    - Read from pub subs
    - Write to pub subs, or a GCS bucket
- Write a small express app to:
    - create an endpoint that takes in a JSON object representing a bird
    - Give the JSON object a timestamp and a unique ID
    - Publish that JSON object to a pubsub topic
- Write a small react app that:
    - Subscribes to a pubsub topic
    - Displays messages received from the pubsub topic
    - Can access the express app from the above step to start the chain of events
    
