FROM node:20-slim

WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy app source
COPY . .

# Cloud Run sets PORT env; expose for local runs
EXPOSE 3000

CMD ["npm", "start"]

