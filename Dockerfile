# syntax=docker/dockerfile:1

# --- Build stage ---
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
# Mount the npm cache so repeated builds reuse already-downloaded packages
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

# --- Serve stage ---
FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Caching strategy:
#   /assets/**  — Vite outputs content-hashed filenames; cache 1 year (immutable)
#   index.html  — entry point must never be stale; revalidate every request
#   everything else (fonts, icons, etc.) — cache 1 day
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
\n\
    gzip on;\n\
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;\n\
\n\
    # Hashed static chunks — cache aggressively\n\
    location ^~ /assets/ {\n\
        add_header Cache-Control "public, max-age=31536000, immutable";\n\
        try_files $uri =404;\n\
    }\n\
\n\
    # Entry point — always revalidate so users get fresh JS references\n\
    location = /index.html {\n\
        add_header Cache-Control "no-cache, must-revalidate";\n\
        try_files $uri =404;\n\
    }\n\
\n\
    # SPA fallback — other static assets cached 1 day\n\
    location / {\n\
        add_header Cache-Control "public, max-age=86400";\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
