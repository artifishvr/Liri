FROM oven/bun:1 

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --production --frozen-lockfile
COPY . .

CMD ["bun", "start"]
