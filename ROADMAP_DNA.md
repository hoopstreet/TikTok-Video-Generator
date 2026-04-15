# 🧬 TikTok-Video-Generator: ROADMAP DNA
**Stable Baseline:** v1.9.1-stable  
**Last Updated:** 2026-04-15  

## 🏗️ Core Infrastructure Mapping
- **Source of Truth:** [GitHub](https://github.com/hoopstreet/TikTok-Video-Generator)
- **Image Registry:** [Docker Hub](https://hub.docker.com/repository/docker/hoopstreet/tiktok-video-generator)
- **Web Interface:** [Hugging Face Space](https://huggingface.co/spaces/hoopstreet/TikTok-Video-Generator)
- **Compute (GPU):** [RunPod Serverless](https://console.runpod.io/serverless/user/endpoint/zoucgz75ukln9s)
- **Storage:** [Hugging Face Bucket (S3)](https://huggingface.co/buckets/hoopstreet/TikTok-Video-Storage)
- **Database:** [Supabase (TikTok-Video-Table)](https://supabase.com/dashboard/project/ixdukafvxqermhgoczou)

## 🛠️ Build & Stability Rules (v1.9.1+)
1. **The dist/ui Path:** The server is hardcoded to look for the UI in `dist/ui/`. 
2. **Babel Runtime:** Browsers compile `.tsx` on-the-fly via Babel CDN to avoid heavy iSH builds.
3. **Trigger Flow:** - Push to GitHub -> GitHub Actions -> Docker Hub Build.
   - Hugging Face & RunPod pull the `latest` tag from Docker Hub.
4. **Hugging Face Presence:** Only `Dockerfile` and `README.md` are synced directly; the rest runs from the Docker image.

## 🚀 Automation Nodes
- **n8n:** Connected to Hugging Face for automated triggers.
- **RunPod Serverless:** Handles the final video generation via API calls from HF/n8n.

## 📂 Data Storage (Public Schema)
- **Table:** `Videos`
- **Fields:** `video_id`, `status`, `s3_url`, `timestamp`
