# Use your heavy GPU base image
FROM hoopstreet/tiktok-video-generator:latest-cuda

USER root

# Setup environment
ENV PORT=7860
ENV APP_MODE=WEB
WORKDIR /app

# Copy your local UI fixes and Scripts into the container
# This ensures v1.8.0 Master Negatives and Cleanup logic are present
COPY scripts/ /app/scripts/
COPY src/ui/ /app/src/ui/
COPY package.json /app/package.json

# Re-run build to apply UI changes (using our rm -rf fix)
RUN rm -rf dist && npm run build

# Ensure scripts are executable
RUN chmod +x /app/scripts/cleanup_videos.sh

# Create local data folder for the Bucket mount
RUN mkdir -p /app/data/videos && chmod -R 777 /app/data

EXPOSE 7860

# Run cleanup on boot, then start the server
CMD ["sh", "-c", "/app/scripts/cleanup_videos.sh && node dist/index.js"]
