FROM hoopstreet/tiktok-video-generator:latest-cuda
ENV APP_MODE=WORKER
CMD ["python", "worker.py"]
