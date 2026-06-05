FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend source code
COPY . .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
