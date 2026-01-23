# Deployment Guide: BrekkySammy on Cloud Run

This guide outlines the steps to build and deploy the BrekkySammy Next.js application to Google Cloud Run.

## Prerequisites

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and initialized.
- Fiberbase project created and Firestore/Auth/Storage enabled.
- Necessary APIs enabled:
  ```bash
  gcloud services enable cloudbuild.googleapis.com \
                         run.googleapis.com \
                         artifactregistry.googleapis.com
  ```

## 1. Build the Container Image

Build the container image using Google Cloud Build and push it to the Google Container Registry.

```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/app
```

## 2. Deploy to Cloud Run

Deploy the containerized application to Cloud Run. Replace the placeholders with your actual configuration values.

```bash
gcloud run deploy brekkysammy \
  --image gcr.io/[PROJECT_ID]/app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="
    NEXT_PUBLIC_FIREBASE_API_KEY=[YOUR_API_KEY],
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=[YOUR_PROJECT_ID].firebaseapp.com,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=[YOUR_PROJECT_ID],
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=[YOUR_PROJECT_ID].firebasestorage.app,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=[YOUR_SENDER_ID],
    NEXT_PUBLIC_FIREBASE_APP_ID=[YOUR_APP_ID]
  "
```
## 3. Automated Deployment (CI/CD)

The project is configured for automated builds and deployments using **Google Cloud Build Triggers**.

### Setup Cloud Build Triggers

1.  Navigate to the [Cloud Build Triggers page](https://console.cloud.google.com/cloud-build/triggers) in the Google Cloud Console.
2.  Connect your GitHub repository (enable the Google Cloud Build GitHub App).
3.  Create a new trigger:
    -   **Name**: `deploy-main`
    -   **Event**: Push to a branch
    -   **Branch**: `^main$`
    -   **Configuration**: Cloud Build configuration file (yaml or json)
    -   **Cloud Build configuration file location**: `cloudbuild.yaml`
4.  **Substitution Variables**: The `cloudbuild.yaml` requires the following variables to bake Firebase config into the build. Click **"ADD VARIABLE"** for each:
    -   `_FIREBASE_API_KEY`
    -   `_FIREBASE_AUTH_DOMAIN`
    -   `_FIREBASE_PROJECT_ID`
    -   `_FIREBASE_STORAGE_BUCKET`
    -   `_FIREBASE_MESSAGING_SENDER_ID`
    -   `_FIREBASE_APP_ID`

Once configured, every merge to `main` will automatically trigger a new build and deployment to Cloud Run.

## Local Development vs. Production
...
