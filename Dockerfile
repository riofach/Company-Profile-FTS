# Tahap 1: Build aplikasi Vite
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Tahap 2: Sajikan dengan Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf 
EXPOSE 80

# HAPUS BARIS HEALTHCHECK DARI SINI
# HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
#  CMD curl -f http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]