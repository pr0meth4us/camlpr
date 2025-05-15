FROM --platform=linux/amd64 python:3.11-slim

# 1) Install runtime + build deps
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential \
      libgl1           \
      libsm6 \
      libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2) Copy in your dependency specs + only the strhub wheel
COPY requirements.txt .
COPY wheels/strhub-*.whl ./wheels/
COPY api/models/ ./models/
# 3) Install everything with extra index for PyTorch CPU wheels
RUN pip install --upgrade pip \
 && pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt \
 && pip install --no-cache-dir ./wheels/strhub-*.whl \
 # 4) Purge build deps & clean caches
 && apt-get purge -y --auto-remove build-essential \
 && rm -rf /root/.cache/pip

# 5) Add your app code (mount /app/models at runtime)
COPY api/ ./api/

EXPOSE 5328

CMD ["gunicorn", "api.app:app", "-w", "4", "-b", "0.0.0.0:5328"]