# base
FROM node:16.16-alpine AS base
RUN npm i -g pnpm

# dependencies
FROM base AS deps
WORKDIR /app/calc-api
COPY --from=calc-event-sourcing-calc-shared /app ../calc-shared

COPY package.json .
COPY pnpm-lock.yaml .
run pnpm install

# build
FROM base as build
WORKDIR /app/calc-api

COPY --from=deps /app/calc-api/node_modules ./node_modules
COPY --from=deps /app/calc-shared ../calc-shared
COPY . .
RUN pnpm prisma generate
RUN pnpm build
RUN pnpm prune --prod

EXPOSE 3000
CMD ["pnpm", "start:prod"]