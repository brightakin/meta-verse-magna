FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Bundle app source
COPY . .

# Compile TypeScript files
RUN npm run build

# Expose port
EXPOSE 4000
EXPOSE 4001

# Start the application
CMD ["npm", "start"]
