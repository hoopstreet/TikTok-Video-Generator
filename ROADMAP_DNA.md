# 🧬 TikTok-Video-Generator: ROADMAP DNA & BLUEPRINT

## 🔑 Service Registry (Credentials & Endpoints)
- **GitHub Master:** `hoopstreet/TikTok-Video-Generator`
- **Docker Hub Repository:** `hoopstreet/tiktok-video-generator`
- **Hugging Face UI Space:** `hoopstreet/TikTok-Video-Generator`
- **Hugging Face Storage:** `hoopstreet/TikTok-Video-Storage` (S3 Mounted)
- **Supabase Project ID:** `ixdukafvxqermhgoczou`
- **RunPod Endpoint:** `zoucgz75ukln9s`

| Secret Variable | Service | Usage |
| :--- | :--- | :--- |
| `HF_TOKEN` | Hugging Face | Pull/Push for Space and S3 Bucket |
| `SUPABASE_URL` | Supabase | Database Endpoint Connection |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Master Administrative Access |
| `RUNPOD_API_KEY` | RunPod | Serverless Video Generation Trigger |

---

## 📈 Evolution Phases (Changelog)

### Phase 1: Infrastructure & Stability (v1.1.3 - v1.9.1)
- **Status:** COMPLETED ✅
- **Milestone:** Resolved the "Blank Screen" via `dist/ui` folder alignment.
- **Tech Stack:** Dockerized Node.js, Babel Standalone (browser-side TSX), Express.
- **Key Logic:** Bypassed iSH memory limits by offloading UI compilation to the client.

### Phase 2: Cloud Integration & Automation (Current)
- **Status:** ACTIVE 🛠️
- **Focus:** Connecting the "Golden Thread" between n8n, Hugging Face, and RunPod.
- **Milestone:** Established `SUPABASE_SERVICE_ROLE_KEY` for backend data persistence.
- **Storage:** Successfully mounted S3 bucket to Hugging Face for video persistence.

---

## 🏗️ Technical Mapping
- **UI Path:** `dist/ui` (Hardcoded requirement for v1.1.3 logic).
- **Video Storage Flow:** RunPod (Gen) -> HF S3 Bucket (Save) -> Supabase `videos` Table (Log).
- **Trigger Logic:** 1. User/n8n hits Hugging Face UI.
  2. HF sends task to RunPod Serverless API.
  3. RunPod processes via CUDA 12.3.1 (Docker Hub Image).

### Phase 3: Automation Orchestration (Upcoming)
- **Status:** INITIALIZING 🚦
- **Focus:** Building the n8n Workflow nodes to trigger RunPod via Hugging Face.
- **Goal:** Fully hands-free video generation from TikTok shop scrapers to Supabase logs.

### Phase 4: Production Scraper Mapping (Active 🛠️)
- **Status:** INITIALIZING 🚦
- **Focus:** Mapping TikTok Scraped data (Positive/Negative Prompts) to the Web UI.
- **Workflow:** n8n Scraper -> Logic Transformation -> HF Web UI -> RunPod GPU.
- **Key Fields:** `text`, `negative_prompt`, `image_url` (must end in .webp/.jpg/.png).

## 🧩 Ecosystem Dependencies
- **Upstream Data 1:** `TikTok-Product-Scraper` (Raw JSON/WebP)
- **Upstream Data 2:** `TikTok-Prompt-Generator` (Positive/Negative Prompts)
- **Downstream Result:** `TikTok-Video-Generator` -> Supabase `videos`

### Phase 4.1: Inter-Project Handshake
- **Status:** ACTIVE 🛠️
- **Target:** Ensure the Video-Generator correctly parses prompts from the Prompt-Generator project.

## 🗄️ Database Schema Relationships (Supabase)
- **Table: TikTok-Product-Table** -> Primary Key: `product_id`
- **Table: TikTok-Prompt-Table** -> Foreign Key: `product_id`, Primary Key: `prompt_id`
- **Table: TikTok-Video-Table** -> Foreign Key: `prompt_id`, Primary Key: `video_id`

## 🔗 Integrated Triggers
1. **Manual:** Hugging Face Web UI (Direct to RunPod)
2. **Automated:** n8n HTTP Node (Triggered by Prompt-Generator completion)

## 🚩 Milestone: v2.0.0-stable (The Ecosystem Release)
- **Status:** RELEASED 🚀
- **Summary:** Integrated 3-project pipeline (Scraper -> Prompt -> Video).
- **Logic Verified:** Supabase schema alignment, Babel UI stability, and RunPod connectivity.

## 🛡️ Production Safety Constraints (v2.0.0+)
1. **URL Handling:** All `image_url` strings must be passed fully encoded to preserve TikTok CDN tokens.
2. **Naming Convention:** STRICT lowercase for Supabase tables (`videos`) and columns (`id`, `video_url`).
3. **Heartbeat:** n8n must send a GET request to the HF Space URL before initiating a POST task to ensure the container is awake.

### Phase 5.1: Ecosystem Alignment (Complete ✅)
- **Status:** VERIFIED
- **Discovery:** Internal React states use `Videos` (safe), Database uses `videos` (required).
- **Automation Sync:** `n8n_trigger_payload.json` updated to `v2.0.0-stable`.
- **Connectivity:** Heartbeat test confirmed (HTTP 200).

### Phase 5.2: CDN Link Validation (Verified ✅)
- **Constraint:** Supports TikTok `~tplv-resize-webp` patterns.
- **Handling:** n8n must pass the full raw URL including all query tokens to ensure CDN access.

## ✅ MILESTONE REACHED: Production Ready (v2.1.0)
- **Image Support:** Verified for complex TikTok CDN query strings.
- **Automation:** n8n payload template confirmed.
- **Deployment:** Tagged and pushed to GitHub main.

### Phase 5.3: Image Optimization (Alert ⚠️)
- **Current Image:** `hoopstreet/tiktok-video-generator:latest-cuda`
- **Size:** 334.3 GB (Critical)
- **Observation:** Large size may impact RunPod cold-start times.
- **Action:** Future builds should use `.dockerignore` to exclude `/static/music` or heavy model weights if they can be downloaded at runtime.
- Status: MONITORING 🔍

### Phase 5.4: Latency & Cold-Start Monitoring
- **Metric:** Target Trigger-to-Render start < 30s.
- **Risk:** Docker image size (334GB) currently exceeds optimal pull speed.
- **n8n Config:** Ensure "Timeout" in HTTP Request node is set to at least 120s to account for image pulls.

## 🏆 MILESTONE REACHED: Full System Integration (v2.2.0)
- **Deployment:** CUDA build path selected and versioned.
- **Optimization:** .dockerignore active to keep context light.
- **Goal Status:** Ready for Bulk TikTok Affiliate Content Generation.

### Phase 5.5: Docker Size Reduction (Targeted 🎯)
- **Goal:** Reduce Docker Hub image from 334GB to < 20GB.
- **Method:** Layer squashing and cache purging in `main-cuda.Dockerfile`.
- **Logic:** Combined RUN commands to prevent layer bloat.
