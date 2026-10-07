# =========================
# Build stage
# =========================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Required to build native Node modules such as argon2
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       python3 \
       make \
       g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files first
# This allows Docker to cache npm install
COPY package*.json ./

RUN npm ci

# Copy application source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Remove dev dependencies before copying to production image
RUN npm prune --omit=dev


# =========================
# Production stage
# =========================
FROM node:22-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy package files
COPY --from=builder /app/package*.json ./

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy Prisma files
COPY --from=builder /app/prisma ./prisma

# Your custom Prisma generated client
COPY --from=builder /app/src/generated ./src/generated

EXPOSE 5000

CMD ["node", "dist/server.js"]