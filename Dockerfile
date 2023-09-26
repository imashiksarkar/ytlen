FROM node:18-alpine AS build

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# -----------------
FROM node:18-alpine as prod

WORKDIR /usr/app

COPY --from=build /usr/app/package*.json .
RUN npm ci --omit=dev

COPY --from=build /usr/app/dist .

# -------------------
FROM gcr.io/distroless/nodejs18-debian12

WORKDIR /usr/app

COPY --from=prod /usr/app .

# ENV API_KEY=**********
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["server.js"]