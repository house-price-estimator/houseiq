FROM node:20

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Explicitly install rollup to ensure native bindings are available
RUN npm install rollup --save-dev

# Copy source code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# For development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# For production, uncomment below and comment above:
# RUN npm run build
# EXPOSE 80
# CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]

