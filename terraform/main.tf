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