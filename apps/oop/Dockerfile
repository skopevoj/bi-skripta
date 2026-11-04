# BI-OOP skripta: static build served by nginx.
# Build context = repo root (Coolify: Base Directory "/", Dockerfile Location "/apps/oop/Dockerfile", port 80).
FROM node:22-alpine AS build
WORKDIR /repo
# Manifests first, so dependencies stay cached until a package.json or the lockfile changes.
COPY package.json package-lock.json ./
COPY packages/ui/package.json packages/ui/
COPY packages/ui/playground/package.json packages/ui/playground/
COPY apps/kab/package.json apps/kab/
COPY apps/kom/package.json apps/kom/
COPY apps/oop/package.json apps/oop/
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build:oop

FROM nginx:1.27-alpine
COPY apps/oop/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/oop/out /usr/share/nginx/html
EXPOSE 80
