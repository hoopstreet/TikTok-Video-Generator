# Start from your heavy GPU base image
FROM hoopstreet/tiktok-video-generator:latest-cuda

USER root

# Setup environment
ENV PORT=7860
ENV APP_MODE=WEB
WORKDIR /app

# Copy from current directory to the container
# This ensures the 'scripts' folder is found during build
COPY ./scripts/ /app/scripts/
COPY ./src/ui/ /app/src/ui/
COPY ./package.json /app/package.json

# Skip heavy rendering build; just ensure scripts are ready
RUN chmod +x /app/scripts/cleanup_videos.sh
RUN mkdir -p /app/data/videos && chmod -R 777 /app/data

EXPOSE 7860

# Start the dashboard/frontend
CMD ["node", "dist/index.js"]
# Last Sync: Mon Apr 13 17:18:26 UTC 2026
