FROM node:23-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# Start the application
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]