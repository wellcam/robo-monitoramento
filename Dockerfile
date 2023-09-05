FROM node:lts-alpine3.18
COPY . .
RUN npm install axios
RUN npm install --save node-cron
RUN npm install node-fetch 
CMD ["node", "app.js"]

EXPOSE 3000