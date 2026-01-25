# Technical Notes & Lessons Learned

## Environment (WSL / Node.js)
> [!IMPORTANT]
> **CRITICAL**: Always prefix Node-dependent commands with `source ~/.nvm/nvm.sh && ...` and run via `wsl bash -l -c`.
- **Command Template**: `wsl bash -l -c "source ~/.nvm/nvm.sh && <command>"`
- **Example**: `wsl bash -l -c "source ~/.nvm/nvm.sh && npm install"`

## Google Cloud Platform (GCP)
- **API Dependencies**: For Cloud Run deployments, ensure the following APIs are enabled:
    - `cloudbuild.googleapis.com`
    - `run.googleapis.com`
    - `artifactregistry.googleapis.com`
- **Propagation Delay**: If `gcloud run deploy` fails to find an image immediately after a successful `gcloud builds submit`, wait 5-10 seconds and retry.

## Shell Quoting (Windows -> WSL)
- **Problem**: Passing complex strings (like env vars) through `wsl bash -l -c` requires heavy escaping of double quotes.
- **Solution**: Use single quotes for the outer `bash -c` wrapper and double quotes (escaped if necessary) for the internal flags.
- **Example**: `wsl bash -l -c "source ~/.nvm/nvm.sh && gcloud run deploy ... --set-env-vars=KEY1=VAL1,KEY2=VAL2"` (Avoiding spaces in the comma-separated list helps).

## Next.js Deployment
- **Standalone Mode**: `Dockerfile` relies on `output: 'standalone'` in `next.config.ts`.
- **Image Domains**: Production deployment crashes if `next/image` is used with external URLs (e.g., Unsplash) without proper `remotePatterns` configuration.
