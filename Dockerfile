# syntax=docker/dockerfile:1
FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy rest of your Flask backend
COPY api .

# Expose port
EXPOSE 5328

# Run app
CMD ["flask", "--app", "app", "run", "--host=0.0.0.0", "--port=5328"]
