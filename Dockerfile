FROM hoopstreet/tiktok-video-generator:latest-cuda

USER root

# Setup environment
ENV PORT=7860
ENV APP_MODE=WEB

# Create data dir
RUN mkdir -p /app/data/videos && chmod -R 777 /app/data

WORKDIR /app

EXPOSE 7860

# We use 'ls' in the start command to debug. 
# It will print the file list to the logs so we can see where the files are.
CMD ["sh", "-c", "ls -R /app && node dist/index.js"]
