resource google_pubsub_topic topic {
  name    = var.topic_name
  project = var.project_id
}


resource google_pubsub_subscription subscription {
  name    = var.subscription_name
  topic   = google_pubsub_topic.topic.name
  project = var.project_id

  message_retention_duration = "1200s"   # 20 minutes
  retain_acked_messages      = true

  ack_deadline_seconds = 20

  expiration_policy {
    ttl = ""
  }
}
