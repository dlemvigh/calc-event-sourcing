# base
FROM node:16.16-alpine AS base
RUN npm i -g pnpm

# dependencies
FROM base AS deps
WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
run pnpm install

# build
FROM base as build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build
RUN pnpm prune --prod