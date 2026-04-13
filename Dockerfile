# Use your pre-built image that already has scripts/dist inside
FROM hoopstreet/tiktok-video-generator:latest-cuda

USER root

# Setup environment
ENV PORT=7860
ENV APP_MODE=WEB

# Create data dir (This doesn't need external files)
RUN mkdir -p /app/data/videos && chmod -R 777 /app/data

EXPOSE 7860

# Start the dashboard/frontend
# We assume cleanup_videos.sh is already at /app/scripts/ inside the image
CMD ["sh", "-c", "/app/scripts/cleanup_videos.sh && node dist/index.js"]
