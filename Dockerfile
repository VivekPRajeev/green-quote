# ---- Base Node image ----
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies for Chromium
RUN apk add --no-cache \
    libc6-compat \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn \
    bash

# Correct path for Alpine Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# ---- Dependencies ----
FROM base AS deps
RUN npm install

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---- Production ----
FROM node:20-alpine AS runner
WORKDIR /app

# Install Chromium in production image
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copy only what’s needed
COPY --from=build /app/next.config.ts ./ 
COPY --from=build /app/public ./public
COPY --from=build /app/package.json ./ 
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
