FROM node:18

WORKDIR /src

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .

EXPOSE 8080

CMD ["pnpm", "start"]
