# Use Node.js 18 Alpine
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
# Instalar todas as dependências (incluindo dev para build)
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

CMD ["npm", "start"]