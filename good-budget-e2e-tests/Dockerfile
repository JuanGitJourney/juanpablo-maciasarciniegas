FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set working directory
WORKDIR /app

# Copy package and lock files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the project files
COPY . .

# Install Playwright browsers (Chromium, Firefox, WebKit)
RUN npx playwright install --with-deps

# Set environment variables (can be overridden at runtime)
ENV BASE_URL='https://www.goodbudget.com'

# Default command to run all tests
CMD ["npm", "test"]
