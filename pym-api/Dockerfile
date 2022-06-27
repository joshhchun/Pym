FROM node:alpine
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm ci
COPY . .

CMD ["npm", "start"]
