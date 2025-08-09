# user\Dockerfile

# build stage
FROM node:24-alpine3.21 AS build
WORKDIR /app
COPY package*.json nx.json ./
COPY shared ./shared
COPY user ./user
RUN npm ci
RUN npm run prisma:generate --workspace=user && npm run build:all

# run stage
FROM node:24-alpine3.21
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
# DB URL passed at runtime
CMD ["sh", "-lc", "npm run prisma:db:push --workspace=user && npm run prisma:db:seed --workspace=user && tail -f /dev/null"]
