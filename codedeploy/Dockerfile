FROM node:16-alpine AS builder

WORKDIR "/app"

COPY . .

RUN yarn install

RUN yarn build

FROM node:16-alpine AS dependencies

WORKDIR "/app"

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --production


FROM node:16-alpine AS production

WORKDIR "/app"

ENV NODE_ENV production

RUN yarn global add pm2

COPY --from=builder /app/dist/ ./dist
COPY --from=builder /app/package.json/ ./package.json
COPY --from=builder /app/codedeploy/pm2/ .

COPY --from=dependencies /app/node_modules/ ./node_modules

RUN chmod 0700 ./entrypoint.sh

ENTRYPOINT ["./entrypoint.sh"]

CMD ["true"]
