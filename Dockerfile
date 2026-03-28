# Single-stage Hybrid Dockerfile for Astro + Node Admin API + Nginx
FROM node:20-alpine
WORKDIR /app

# Install Nginx and rsync
RUN apk add --no-cache nginx rsync

# Enable high memory limit for the Matrix build
ENV NODE_OPTIONS="--max-old-space-size=16384"
ENV ADMIN_TOKEN=""
ENV RENDER_PSEO="true"

# Install dependencies (only copy package files first for caching)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Run the initial build (Controlled by RENDER_PSEO env var)
# If RENDER_PSEO=false is set in Coolify, this takes 30s. 
# If RENDER_PSEO=true, it builds the full 280k matrix (approx 1hr).
RUN npm run build

# Configure Nginx
# Remove default config and link our project config
RUN rm -rf /etc/nginx/http.d/default.conf
COPY nginx.conf /etc/nginx/http.d/default.conf

# Ensure Nginx can serve our files directly on port 80
EXPOSE 80 8100/tcp

# Start Nginx in background and Node.js in foreground using npm run preview (which runs server.js)
CMD ["sh", "-c", "nginx -g 'daemon off;' & npm run preview"]
