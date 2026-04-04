FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install

RUN pip3 install -r requirements.txt --break-system-packages

RUN mkdir -p database website

EXPOSE 8080

CMD ["node", "server/index.js"]
