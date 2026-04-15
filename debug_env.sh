echo "--- System Check ---"
ffmpeg -version | head -n 1
node -v
npm -v
echo "--- Permissions Check ---"
ls -ld /app/data/videos
