FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source and compiled files
COPY . .

# Build TypeScript (se necessário)
RUN npm run build

EXPOSE 3001

CMD ["node", "lib/server.js"]