# Stage 1: Dependencies build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Stage 2: Runtime
FROM node:20-alpine

# Create app directory and set ownership
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Copy node_modules from builder
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
# Copy application code
COPY --chown=node:node . .

# Remove npm and yarn to eliminate vulnerabilities in the final image
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx /opt/yarn-* /usr/local/bin/yarn /usr/local/bin/yarnpkg

# Use the non-root 'node' user
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
