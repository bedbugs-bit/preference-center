# Use Node.js LTS image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the application files
COPY . .

# Expose the application port
EXPOSE 9010

# Start the application
CMD ["npm", "start"]
