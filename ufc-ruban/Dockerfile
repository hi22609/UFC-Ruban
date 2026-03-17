FROM node:20-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

RUN npm install --prefix ufc-ruban

RUN pip3 install -r ufc-ruban/requirements.txt --break-system-packages

# Create required directories
RUN mkdir -p ufc-ruban/database ufc-ruban/website

EXPOSE 8080

CMD ["node", "ufc-ruban/server/index.js"]
