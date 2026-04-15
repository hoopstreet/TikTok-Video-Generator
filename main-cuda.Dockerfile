# Use a specific, stable CUDA runtime to keep it light
FROM nvidia/cuda:12.3.1-runtime-ubuntu22.04

# Set production environment
ENV NODE_ENV=production \
    DEBIAN_FRONTEND=noninteractive

# Combine commands into ONE layer to keep size small
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    fonts-noto-color-emoji \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y node_modules nodejs \
    # Cleanup Apt cache in the SAME layer
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only what is needed (utilizing our new .dockerignore)
COPY package.json . 
RUN npm install --omit=dev && npm cache clean --force

COPY . .

# Build the app and remove source maps to save space
RUN npm run build && rm -rf src/

EXPOSE 7860
CMD ["npm", "start"]
