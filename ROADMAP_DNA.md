# 🧬 TikTok-Video-Generator: THE PHOENIX (v2.4.0)

## 🏗️ SYSTEM ARCHITECTURE (6-POINT SYNC)
1. **GitHub (Source):** Full source code & CI/CD Orchestration.
2. **Hugging Face (Frontend):** Web UI & Proxy Layer for triggers.
3. **RunPod (Backend):** Serverless GPU nodes executing the heavy video rendering.
4. **HF S3 Bucket (Storage):** Persistent home for all generated .mp4 files.
5. **Supabase (Database):** Table `TikTok-Video-Table` for logging & tracking.
6. **DockerHub (Image):** Registry for `hoopstreet/tiktok-video-generator:latest-cuda`.

## 🔄 AUTOMATED PIPELINES
- **Code Edit:** Trigger `docker-build.yml` -> Bakes `dist/` -> Pushes to DockerHub.
- **Dockerfile Edit:** Trigger `hf-sync.yml` -> Orphan Push -> Syncs `Dockerfile` & `README.md` to HF Space.
- **RunPod Sync:** Automatically pulls `:latest-cuda` from DockerHub on every task trigger.

## 🔗 TRIGGER INTERFACE
- **Manual:** User inputs data directly into the Hugging Face Space UI.
- **Automated (n8n):** HTTP Request from n8n -> HF Space Proxy -> RunPod Serverless.

## 🗄️ DATABASE MAPPING (Supabase)
- **Organization:** TikTok-Affiliate-Marketing
- **Schema:** Public
- **Primary Table:** `TikTok-Video-Table`
- **Relationship:** Linked to `TikTok-Prompt-Table` via `prompt_id`.

## 🛡️ MAINTENANCE
- **Janitor:** Supabase Edge Function handles 24h rolling cleanup of database rows.
- **Integrity:** `production_check.sh` ensures `dist/index.js` exists in every build.

## 🔑 CREDENTIALS MASTER REGISTRY (v2.4.0)
*Use this guide to verify or rotate keys in your service dashboards.*

### 1. GitHub Secrets & Variables
**Location:** `Settings > Secrets and Variables > Actions`
- **Secret:** `DOCKERHUB_TOKEN` → [Your Docker Hub PAT]
- **Secret:** `HF_TOKEN` → [Your Hugging Face Write Token]
- **Secret:** `SUPABASE_PROJECT_ID` → `ixdukafvxqermhgoczou`
- **Secret:** `SUPABASE_SERVICE_ROLE_KEY` → [Your Supabase Service Role Key]
- **Variable:** `DOCKERHUB_USERNAME` → `hoopstreet`

### 2. Hugging Face Space Settings
**Location:** `Settings > Variables and Secrets`
- **Secret:** `RUNPOD_API_KEY` → [Your RunPod API Key]
- **Secret:** `SUPABASE_URL` → `https://ixdukafvxqermhgoczou.supabase.co`
- **Variable:** `RUNPOD_ENDPOINT_ID` → `zoucgz75ukln9s`
- **Variable:** `APP_MODE` → `WEB`
- **Variable:** `PORT` → `7860`

### 3. RunPod Serverless Template
**Location:** `Serverless > Templates > Edit`
- **Container Image:** `hoopstreet/tiktok-video-generator:latest-cuda`
- **Env Var:** `SUPABASE_URL` → `https://ixdukafvxqermhgoczou.supabase.co`
- **Env Var:** `SUPABASE_SERVICE_ROLE_KEY` → [Same as GitHub Secret]
- **Env Var:** `S3_MOUNT_PATH` → `/app/data/storage`

### 4. n8n HTTP Node Headers
**Location:** `TikTok-Video-Generator Node`
- **Header:** `Authorization` → `Bearer [HF_TOKEN]`
- **Header:** `Content-Type` → `application/json`

---
