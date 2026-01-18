#Build
FROM node:25 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Deploy
FROM node:25-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY package*.json ./

RUN npm ci --omit=dev

CMD ["node", "dist/index.js"]