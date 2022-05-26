FROM node:16.14.0

WORKDIR /app
COPY . .
RUN npm install cross-env
RUN npm install

CMD ["node", "/app/dist/main.js"]