FROM node:latest

RUN mkdir -p /usr/api
WORKDIR /usr/api

# install dependencies, npm is preinstalled from image
# we'll eventually want to ship the container with node_modules already there
# for now always get the latest version of dependencies
COPY package.json /usr/api
COPY build /usr/api
RUN npm install

# Install PM2
RUN npm install -g pm2

# Expose ports
EXPOSE 3000

# init service
CMD [ "npm", "run", "prod"]
