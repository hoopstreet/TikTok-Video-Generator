FROM hoopstreet/tiktok-video-generator:latest-cuda
ENV PORT=7860
EXPOSE 7860
CMD ["pnpm", "start"]
