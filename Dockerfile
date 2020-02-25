FROM node:10-alpine

RUN mkdir central-module

WORKDIR /central-module

COPY . .

EXPOSE 4015

CMD npm run prod:docker
