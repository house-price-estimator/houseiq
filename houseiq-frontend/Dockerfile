FROM node:20

WORKDIR /app

# Copy package files (including lock file for version consistency)
COPY package*.json ./

# Install dependencies - use npm ci to preserve exact versions
# Include optional dependencies for Rollup native bindings
RUN npm ci --include=optional || npm install --include=optional

# Explicitly install Rollup native binding after main install
# This doesn't modify package-lock.json due to --no-save flag
RUN npm install --no-save --force @rollup/rollup-linux-x64-gnu || true

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