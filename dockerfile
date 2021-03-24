FROM node:lts-alpine3.10
RUN mkdir /server
ADD . /server
WORKDIR /server
RUN npm install
EXPOSE 3000
RUN npm start