# Build stage
FROM node:20-alpine as build

WORKDIR /app

ARG VITE_QUIKNOTE_URL
ARG VITE_QUIKCODE_URL

ENV VITE_QUIKNOTE_URL=$VITE_QUIKNOTE_URL
ENV VITE_QUIKCODE_URL=$VITE_QUIKCODE_URL

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app to nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]