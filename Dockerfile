FROM python:3.11-slim

# Install OS dependencies and git (required for pip git+ installs)
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      gcc ffmpeg libsm6 libxext6 git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 1) Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt \
 && pip install gunicorn \
 && pip install --no-cache-dir git+https://github.com/baudm/parseq.git@main

# 2) Copy ML models from api/models into /app/models
COPY api/models/ ./models/

# 3) Copy your Flask API code
COPY api/ ./api/

# Environment variables
ENV FLASK_APP=api/app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5328

CMD ["gunicorn", "api.app:app", "-w", "4", "-b", "0.0.0.0:5328"]
