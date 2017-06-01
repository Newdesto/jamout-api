FROM node:latest

ENV NODE_ENV=production

RUN mkdir -p /api
WORKDIR /api

# install dependencies, npm is preinstalled from image
# we'll eventually want to ship the container with node_modules already there
# for now always get the latest version of dependencies
COPY package.json /api
COPY build /api
RUN npm install -g

# Install PM2
RUN npm install -g pm2

# Expose ports
EXPOSE 3000

# init service
CMD [ "pm2-docker", "index.js"]
