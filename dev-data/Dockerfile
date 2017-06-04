FROM node:6.10.0

ENV NODE_ENV=development

RUN mkdir -p /dev-data
WORKDIR /dev-data

# install dependencies, npm is preinstalled from image
# we'll eventually want to ship the container with node_modules already there
# for now always get the latest version of dependencies
COPY ./index.babel.js /dev-data
COPY ./index.js /dev-data
COPY ./dynamodb-tables.js /dev-data
COPY ./package.json /dev-data
COPY ./yarn.lock /dev-data
RUN yarn install

# init service
CMD [ "node", "./index.babel.js"]
