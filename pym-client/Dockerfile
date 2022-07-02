FROM node:alpine as build
WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .
RUN npm run build

FROM nginx:latest
COPY --from=build /usr/src/app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

