FROM hoopstreet/tiktok-video-generator:latest-cuda
ENV PORT=3123
CMD ["pnpm", "start"]
