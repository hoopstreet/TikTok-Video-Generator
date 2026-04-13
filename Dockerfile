FROM hoopstreet/tiktok-video-generator:latest-cuda

USER root

# Setup environment
ENV PORT=7860
ENV APP_MODE=WEB

# Create data dir
RUN mkdir -p /app/data/videos && chmod -R 777 /app/data

WORKDIR /app

EXPOSE 7860

# Pointing exactly to where the Web UI lives
# This will keep the container alive
CMD ["node", "dist/server/index.js"]
