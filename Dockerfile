FROM hoopstreet/tiktok-video-generator:latest-cuda

USER root
ENV PORT=7860
ENV APP_MODE=WEB

RUN mkdir -p /app/data/videos && chmod -R 777 /app/data
WORKDIR /app

EXPOSE 7860

# This version uses a shell to check file existence before running
CMD ["sh", "-c", "ls -R /app/dist && node /app/dist/server/index.js"]
