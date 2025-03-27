# Use official Node.js image as base for the build stage
FROM node:18 AS build

EXPOSE 3000
# Set working directory for the app
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) files
COPY ./package*.json ./

# Install dependencies
RUN npm install
RUN npm install -g serve
# Copy the rest of the app source code
COPY . .

# Build the React app
RUN npm run build

# Use Nginx to serve the built app
#FROM nginx:alpine

# Copy build files from the build stage to Nginx serving directory
#COPY --from=build /app/build /usr/share/nginx/html

# Start Nginx in the foreground
CMD ["serve","-s","build"]
