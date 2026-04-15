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
