# STAGE 1: Build Whisper.cpp (Tiny Model)
FROM ubuntu:22.04 AS install-whisper
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y --no-install-recommends \
    git build-essential wget cmake ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
WORKDIR /whisper
RUN git clone https://github.com/ggml-org/whisper.cpp.git . && \
    git checkout v1.7.1 && \
    make
WORKDIR /whisper/models
RUN sh ./download-ggml-model.sh tiny.en

# STAGE 2: Node Base with Hardened Networking
# Switching to standard bookworm to solve Exit Code 100 networking errors
FROM node:22-bookworm AS base
ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# FIXED: Force IPv4 and use a reliable mirror to bypass GitHub runner network hangs
RUN echo 'Acquire::ForceIPv4 "true";' > /etc/apt/apt.conf.d/99force-ipv4 && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    apt-get update -y || (sleep 5 && apt-get update -y) && \
    apt-get install -y --no-install-recommends \
      git wget cmake ffmpeg curl make libsdl2-dev \
      libnss3 libdbus-1-3 libatk1.0-0 libgbm-dev libasound2 \
      libxrandr2 libxkbcommon-dev libxfixes3 libxcomposite1 \
      libxdamage1 libatk-bridge2.0-0 libpango-1-0-0 libcairo2 libcups2 \
      fonts-noto-color-emoji fonts-noto-cjk \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# ALIGNMENT: Force pnpm v9.15.4 to match your lockfileVersion 9.0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# STAGE 3: Production Dependencies
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml /app/
RUN pnpm install --prod --frozen-lockfile

# STAGE 4: Build Application
FROM prod-deps AS build
COPY tsconfig.json tsconfig.build.json vite.config.ts /app/
COPY src /app/src
COPY static /app/static
RUN pnpm install --frozen-lockfile
RUN pnpm build

# STAGE 5: Final Production Image
FROM base
WORKDIR /app
COPY static /app/static
COPY --from=install-whisper /whisper /app/data/libs/whisper
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY package.json /app/

ENV DATA_DIR_PATH=/app/data
ENV DOCKER=true
ENV WHISPER_MODEL=tiny.en
ENV KOKORO_MODEL_PRECISION=q4
ENV CONCURRENCY=1
ENV VIDEO_CACHE_SIZE_IN_BYTES=2097152000

# Install Kokoro voices and Headless Chrome
RUN node dist/scripts/install.js

EXPOSE 3123
CMD ["pnpm", "start"]
