# BeliLite Dockerfile
# This file tells Docker how to build a container for your application

# Use Node.js 18 as the base image (Alpine Linux for smaller size)
# Alpine is a minimal Linux distribution - makes the image smaller
FROM node:18-alpine

# Set the working directory inside the container
# All commands will run from this directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
# Docker caches layers, so if package.json doesn't change, 
# it won't reinstall dependencies
COPY package*.json ./

# Install dependencies
# --production flag would skip dev dependencies, but we need all deps
RUN npm ci --only=production

# Copy the rest of the application files
# This includes server.js, public/ folder, etc.
COPY . .

# Expose port 3000 to the outside world
# This tells Docker which port the app will use
EXPOSE 3000

# Set environment variable for production
ENV NODE_ENV=production

# Command to run when container starts
# This starts your Node.js server
CMD ["node", "server.js"]

