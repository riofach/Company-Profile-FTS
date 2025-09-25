# Dockerfile untuk Railway Deployment
# Optimized for Fujiyama Technology Solutions

# =============================================================================
# BASE STAGE - Install dependencies
# =============================================================================
FROM node:18-alpine AS base

# Install system dependencies
RUN apk add --no-cache libc6-compat curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for TypeScript)
RUN npm ci

# =============================================================================
# BUILDER STAGE - Build the application
# =============================================================================
FROM base AS builder

# Copy source code
COPY . .

# Set build environment variables
ENV NODE_ENV=production
ENV VITE_SITE_URL=https://your-app-name.railway.app
ENV VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Build the application
RUN npm run build

# =============================================================================
# PRODUCTION STAGE - Nginx server
# =============================================================================
FROM nginx:alpine AS runner

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx /var/log/nginx

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# =============================================================================
# DEVELOPMENT STAGE (for Railway development environment)
# =============================================================================
FROM runner AS development

# Copy development files
COPY --from=builder /app /app-dev

# Install development dependencies
RUN apk add --no-cache nodejs npm

# Expose development port
EXPOSE 3000

# Development command (for local development)
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 3000"]
