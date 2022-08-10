#FROM 658310991765.dkr.ecr.us-east-1.amazonaws.com/node:alpine
FROM node:alpine

WORKDIR /location
ARG PORT_ARG=5000
ARG GOOGLE_GEOCODE_URL_ARGS=https://maps.googleapis.com/maps/api/geocode/json
ARG GOOGLE_PLACE_URL_ARGS=https://maps.googleapis.com/maps/api/place/autocomplete/json
ARG NATS_URL_ARG=http://localhost:4222
ARG NATS_CLUSTER_ID_ARG=location

ENV PORT $PORT_ARG
ENV NATS_URL $NATS_URL_ARG
ENV NATS_CLUSTER_ID $NATS_CLUSTER_ID_ARG

ENV GOOGLE_GEOCODE_URL $GOOGLE_GEOCODE_URL_ARGS
ENV GOOGLE_PLACE_URL $GOOGLE_PLACE_URL_ARGS

COPY package.json .
RUN npm install 

COPY . .

EXPOSE $PORT

CMD ["npm", "start"]