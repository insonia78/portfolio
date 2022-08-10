FROM node:alpine

WORKDIR /first-rx-common-lib
COPY package.json .
# COPY tsconfig.json ./

RUN npm install
RUN npm install typescript --save-dev
RUN npm install tsc
RUN npm run build
 


# FROM alpine:3
# RUN apk add nodejs --no-cache
# WORKDIR /first-rx-common-lib

# CMD node index.js