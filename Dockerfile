FROM node:12-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build
###

FROM node:12-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/typeorm typeorm
COPY --from=builder /usr/src/app/dist dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/yarn.lock ./

RUN yarn install --production
RUN touch .env && yarn add ts-node

CMD yarn start:migration && yarn start:prod