terraform {
  backend "gcs" {}
}

data "google_project" "project" {
  project_id = var.gcp_project_id
}


## PUBSUB

module take_flight_pubsub {
  source = "./modules/pubsub"

  project_id        = var.gcp_project_id
  topic_name        = "take_flight"
  subscription_name = "take_flight"
}

module start_migration_pubsub {
  source = "./modules/pubsub"

  project_id        = var.gcp_project_id
  topic_name        = "start_migration"
  subscription_name = "start_migration"
}

module depart_ne_pubsub {
  source = "./modules/pubsub"

  project_id        = var.gcp_project_id
  topic_name        = "depart_ne"
  subscription_name = "depart_ne"
}

module depart_ma_pubsub {
  source = "./modules/pubsub"

  project_id        = var.gcp_project_id
  topic_name        = "depart_ma"
  subscription_name = "depart_ma"
}

module arrival_pubsub {
  source = "./modules/pubsub"

  project_id        = var.gcp_project_id
  topic_name        = "arrival"
  subscription_name = "arrival"
}

## STORAGE

resource google_storage_bucket arrival_bucket {
  name     = "arrival_bucket"
  location = "US"
  project  = var.gcp_project_id
}

data google_storage_project_service_account gcs_account {
}

resource google_pubsub_topic_iam_binding binding {
  topic   = module.arrival_pubsub.topic_id
  role    = "roles/pubsub.publisher"
  members = ["serviceAccount:${data.google_storage_project_service_account.gcs_account.email_address}"]
}

resource google_storage_notification arrival_notification {
  bucket         = google_storage_bucket.arrival_bucket.name
  payload_format = "JSON_API_V1"
  topic          = module.arrival_pubsub.topic_id
  event_types    = ["OBJECT_FINALIZE"]
  depends_on = [google_pubsub_topic_iam_binding.binding]
}

## CLOUD FUNCTIONS

resource google_storage_bucket cloud_fn_bucket {
  name = "cloud-fn-bucket"
}

resource google_storage_bucket_object archive {
  name   = "index.zip"
  bucket = google_storage_bucket.cloud_fn_bucket.name
  source = "./cloud_functions/output/index.zip"
}

resource google_cloudfunctions_function liftoff {
  name        = "liftoff"
  description = "Listens to the take_flight pubsub, posts to the start_migration pubsub"
  runtime     = "nodejs10"

  source_archive_bucket = google_storage_bucket.cloud_fn_bucket.name
  source_archive_object = google_storage_bucket_object.archive.name
  trigger_http          = true
  entry_point           = "liftoff"
}

resource google_cloudfunctions_function_iam_member invoker {
  project        = google_cloudfunctions_function.liftoff.project
  region         = google_cloudfunctions_function.liftoff.region
  cloud_function = google_cloudfunctions_function.liftoff.name

  event_trigger = {
    event_type = "google.pubsub.topic.publish"
    resource = module.take_flight_pubsub.topic_id
  }

  environment_variables = {
    UNSPLASH_ACCESS_KEY = "QjEVYBA0V2FpmylQX3c-f2RIgo7DRo6Z4WLPmgRvcrY"
    PUBSUB_TOPIC = module.start_migration_pubsub.topic_id
  }
  
  role   = "roles/cloudfunctions.invoker"
  member = "allUsers"
}