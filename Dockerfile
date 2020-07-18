FROM node:10-alpine

WORKDIR /usr/src/app
COPY package.json .

RUN yarn

COPY . .

RUN yarn build

COPY --chown=node:node . .

USER node

EXPOSE 3333

CMD ["yarn", "start"]