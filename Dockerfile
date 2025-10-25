# Use Node image for development
FROM node:20

# Set working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json for npm install
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application
COPY . .

# Expose the port for Vite's development server
EXPOSE 5181

# Start the Vite development server
CMD ["npm", "run", "dev"]
