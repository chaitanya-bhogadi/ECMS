FROM node:16 AS build
WORKDIR /build
 
COPY public/ public
COPY src/ src
COPY . .
RUN npm install
EXPOSE 3000
CMD npm start