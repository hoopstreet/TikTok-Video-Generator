FROM hoopstreet/tiktok-video-generator:latest-cuda
USER root
ENV PORT=7860
ENV APP_MODE=WEB
RUN mkdir -p /app/data/videos && chmod -R 777 /app/data
WORKDIR /app
EXPOSE 7860
# This matches your working logs
CMD ["node", "dist/server/index.js"]
