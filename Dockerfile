FROM python:3.11-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends gcc ffmpeg libsm6 libxext6 \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Only reinstall deps when requirements.txt changes
# 1) Copy only requirements & install
COPY requirements.txt .
RUN pip install --upgrade pip \
 && pip install --no-cache-dir -r requirements.txt \
 && pip install gunicorn

# 2) Bring in your models (from api/models → /app/models)
COPY api/models/ ./models/

# 3) Bring in the rest of your code
COPY api/ ./api/

ENV FLASK_APP=api/app.py \
    FLASK_ENV=production \
    PYTHONUNBUFFERED=1

EXPOSE 5328
CMD ["gunicorn", "api.app:app", "-w", "4", "-b", "0.0.0.0:5328"]