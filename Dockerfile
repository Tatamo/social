FROM node:20.3.1-bookworm-slim AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:ts

FROM node:20.3.1-bookworm-slim

WORKDIR /usr/src/app

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

COPY package*.json ./
RUN npm install

COPY --from=builder /usr/src/app ./

CMD [ "npm", "start" ]
