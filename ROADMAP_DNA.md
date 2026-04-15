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
- **Video Storage Flow:** RunPod (Gen) -> HF S3 Bucket (Save) -> Supabase `Videos` Table (Log).
- **Trigger Logic:** 1. User/n8n hits Hugging Face UI.
  2. HF sends task to RunPod Serverless API.
  3. RunPod processes via CUDA 12.3.1 (Docker Hub Image).
