FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Render provides the PORT environment variable
CMD sh -c "uvicorn app:app --host 0.0.0.0 --port ${PORT:-10000}"