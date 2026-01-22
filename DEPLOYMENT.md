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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase Web API Key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase Auth Domain. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Google Cloud Project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase Messaging Sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID. |

## Local Development vs. Production

The `Dockerfile` uses the `standalone` output from Next.js for a lightweight production image. Ensure `output: 'standalone'` is set in `next.config.ts`.
