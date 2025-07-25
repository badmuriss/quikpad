FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Install PM2 globally
RUN npm install -g pm2

# Copy source and compiled files
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 3001

# Use PM2
CMD ["pm2-runtime", "start", "lib/server.js", "--name", "quikpad-backend"]