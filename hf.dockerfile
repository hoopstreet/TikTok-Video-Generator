FROM hoopstreet/tiktok-video-generator:latest-cuda
ENV APP_MODE=FRONTEND
EXPOSE 7860
CMD ["python", "app.py"]
