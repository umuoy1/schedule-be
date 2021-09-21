FROM node:alpine
WORKDIR /app
COPY package.json
RUN npm i --registry=https://registry.npm.taobao.org
COPY . /app
CMD node /app/app.js