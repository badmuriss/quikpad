# --- Test & Build stage (Debian-based) ---
FROM node:20-slim AS builder

# Install libcurl for test dependencies
RUN apt-get update && apt-get install -y \
    curl \
    libcurl4 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Run tests and build
RUN npm run test
RUN npm run build

# --- Production stage (Alpine) ---
FROM node:20-alpine AS production

# Install curl and libcurl in Alpine stage
RUN apk add --no-cache curl libcurl

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Install PM2 globally
RUN npm install -g pm2

# Copy built files from the builder stage
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/package*.json ./

EXPOSE 3001

# Use PM2
CMD ["pm2-runtime", "start", "lib/server.js", "--name", "quikpad-backend"]