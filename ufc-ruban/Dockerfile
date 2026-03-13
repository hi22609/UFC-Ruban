FROM node:20-slim

# Install Python and pip
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Node dependencies
COPY package.json .
RUN npm install

# Install Python dependencies
COPY requirements.txt .
RUN pip3 install -r requirements.txt --break-system-packages

# Copy all files
COPY . .

EXPOSE 3000

CMD ["node", "server/index.js"]
