FROM node:18-alpine
COPY . /apps
RUN cd /apps/restful-status-app && npm install && npm run build
WORKDIR /apps/restful-status-api
CMD ["node","server.js"]