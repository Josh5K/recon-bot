FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apk add --no-cache ffmpeg

COPY . .

CMD ["node", "main.js"]
