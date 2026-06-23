FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml* ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["node", "--import", "tsx", "src/index.ts"]
