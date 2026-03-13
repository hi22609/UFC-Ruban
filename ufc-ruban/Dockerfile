FROM node:20-slim

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything first
COPY . .

# Install Node dependencies
RUN npm install --prefix ufc-ruban

# Install Python dependencies
RUN pip3 install -r ufc-ruban/requirements.txt --break-system-packages

EXPOSE 8080

CMD ["node", "ufc-ruban/server/index.js"]
