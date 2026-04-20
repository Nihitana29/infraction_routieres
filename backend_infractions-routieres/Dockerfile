FROM node:20-alpine

# Create app directory and set ownership
RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

# Copy package files with correct ownership
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm install --production

# Copy application code with correct ownership
COPY --chown=node:node . .

# Use the non-root 'node' user
USER node

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
