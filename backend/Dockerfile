FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Cloud Run sets PORT env; expose for local runs
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

