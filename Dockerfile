# Use slim Python image
FROM python:3.11-slim

# Install any OS-level deps you need for cv2/Paddle/etc
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       gcc ffmpeg libsm6 libxext6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy your Flask code
COPY api/ ./api

# Tell Flask where the app is
ENV FLASK_APP=api/app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

EXPOSE 5000

# Use Gunicorn for production-style serving (4 workers)
CMD ["gunicorn", "api.app:app", "-w", "4", "-b", "0.0.0.0:5000"]
