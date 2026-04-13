FROM hoopstreet/tiktok-video-generator:latest-cuda

USER root
ENV PORT=7860
ENV APP_MODE=WEB

RUN mkdir -p /app/data/videos && chmod -R 777 /app/data
WORKDIR /app

EXPOSE 7860

# Trying the root dist entry point which often handles sub-routing
CMD ["node", "dist/index.js"]
