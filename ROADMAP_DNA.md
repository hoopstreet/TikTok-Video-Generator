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

### Phase 5.53: STRATEGIC RETREAT TO 4.2 🛡️
- **Action:** Hard reset to Commit `3516cb9`.
- **Status:** Reverted to "Phase 4.2: Full Ecosystem Database Mapping and Trigger Logic Sync."
- **Goal:** Restore a known stable environment and re-evaluate the transition to Phase 5 build automation.

### Phase 5.54: STABLE BASELINE RE-ESTABLISHED 🏰
- **Version:** v2.0.0-DEBUG (Phase 4.2 Legacy)
- **Status:** SUCCESS. Web UI mode active, Server module dynamically loaded.
- **Diagnostics:** - `dist/index.js` verified and accessible.
    - CUDA environment initialized (CPU Fallback active for HF).
    - Port 7860 responding to Proxy Server.
- **Lesson Learned:** Infrastructure "optimizations" must not move `dist/` or `tsc` steps out of the main image-baking pipeline until caching layers are fully understood.

## PHASE 6.0: HYBRID PRODUCTION STABILITY 🚀
- **Strategy:** Combined v2.0.0 Stable Engine with Phase 5 Automation.
- **Upgrades Integrated:**
    - ✅ **Supabase Edge Janitor:** Daily 24h rolling cleanup (Automated).
    - ✅ **Lean HF Sync:** Orphan-style push to keep Space storage optimized.
    - ✅ **S3 Persistence:** Video storage decoupled from container lifecycle.
- **Infrastructure:** Local (iSH) -> GitHub -> [Supabase / Docker Hub / HF Space].

### Phase 6.01: LFS Bypass & Asset Pruning 🎸
- **Issue:** HF rejected push due to >10MB MP3 files in `static/music/`.
- **Fix:** Upgraded `hf-sync.yml` to an **Orphan Push** strategy.
- **Logic:** The workflow now strips all binary assets and only sends `Dockerfile`, `README`, and `DNA` to Hugging Face.
- **Result:** Space remains <1MB while the full source (including music) stays safe on GitHub.

---

### Phase 6.1: The "Golden Thread" Infrastructure Upgrades 🧵
*These upgrades were salvaged from Phase 5 and are now fully operational in the current Phase 6.0 hybrid architecture:*

- **Upgraded S3 Asset Lifecycle (Phase 5.34/5.35):**
    - **Logic:** Decoupled video storage from the container. All generated TikTok clips are now routed through the `hoopstreet/TikTok-Video-Storage` S3 mount.
    - **Result:** Space rebuilds no longer wipe generated affiliate content.

- **Supabase Edge "Janitor" v3 (Phase 5.32):**
    - **Logic:** Automated database cleanup moved to `supabase/functions/janitor`.
    - **Protocol:** Deployed via GitHub Actions (`supabase-deploy.yml`). No longer depends on local n8n or iSH cron jobs.

- **Orphan-Branch Deployment (Phase 5.29/6.01):**
    - **Logic:** Hugging Face Space is now a "Headless Runner."
    - **Security:** The HF branch contains ZERO source code or large assets—only the `Dockerfile` pointer to Docker Hub.
    - **Bypass:** Successfully circumvents the 10MB Git limit by excluding the `static/music` folder during sync.

- **Serverless GPU Scaling (Phase 5.35):**
    - **Logic:** RunPod endpoint `zoucgz75ukln9s` now pulls the exact `:latest-cuda` image confirmed by the iSH production check.
    - **Environment:** Secrets (Supabase/S3) are injected at the RunPod Template level, keeping the local code clean of hardcoded keys.

- **Build-Time Integrity (Phase 5.48/5.51):**
    - **Logic:** Full-Stack build alignment ensures `tsc` (Server) and `vite` (UI) are compiled in the cloud before the image is pushed.
    - **Fix:** Resolved the `MODULE_NOT_FOUND` error by baking the `dist/` folder into the Docker Hub image layers.

---

### 🛡️ VERIFIED PRODUCTION STATUS (2026-04-16)
- **Engine:** v2.0.0-DEBUG (Stable Core)
- **Automation:** Phase 6.0 (Cloud-First)
- **Status:** **READY FOR SCALING** 🚀
