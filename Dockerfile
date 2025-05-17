#################################################################
# ---------------------------- Build --------------------------- #
#################################################################
FROM python:3.11-slim AS builder

# 1. compiler & headers (build stage only)
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential git \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# 2. copy deps first (better layer cache)
COPY api/requirements.txt ./requirements.txt
COPY api/wheels/strhub-*.whl ./wheels/

# 3. venv in /opt/venv to keep runtime clean
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \
    PIP_NO_CACHE_DIR=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONOPTIMIZE=2

# 4. install deps + gunicorn + uvicorn
RUN pip install --upgrade pip \
 && pip install --extra-index-url https://download.pytorch.org/whl/cpu \
      -r requirements.txt \
      gunicorn uvicorn \
 && pip install --no-deps ./wheels/strhub-*.whl \
 && find /opt/venv -name '__pycache__' -exec rm -rf {} + \
 && rm -rf /root/.cache/pip

#################################################################
# --------------------------- Runtime -------------------------- #
#################################################################
FROM python:3.11-slim

# 5. slim runtime libs for OpenCV
RUN apt-get update \
 && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 libsm6 libxext6 \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# 6. copy pre-built venv
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 PYTHONDONTWRITEBYTECODE=1 PYTHONOPTIMIZE=2 \
    OMP_NUM_THREADS=1 MKL_NUM_THREADS=1 \
    PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:64 \
    YOLO_CONFIG_DIR=/app/.config/Ultralytics \
    PYTHONPATH=/app

# 7. code - THE KEY FIX IS HERE
WORKDIR /app

# Copy the app directory first, keeping the directory structure
COPY api/app ./app/
COPY api/asgi.py ./api/asgi.py

# Make sure api is a package
RUN mkdir -p /app/api
RUN test -f api/__init__.py || echo '# pkg stub' > api/__init__.py

# Copy the rest of the files
COPY api/models ./models/
COPY api/wsgi.py ./wsgi.py

# writable config dir for Ultralytics
RUN mkdir -p /app/.config/Ultralytics && chmod -R 777 /app/.config \
 && find /app -name '__pycache__' -exec rm -rf {} + \
 && find /app -name '*.pyc' -delete

# 8. non-root
RUN useradd -m appuser
USER appuser

EXPOSE 5328

#################################################################
# ------------------------- Entrypoint ------------------------- #
#################################################################
# Gunicorn supervises; each worker is a Uvicorn ASGI instance
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "api.asgi:asgi_app", \
     "--bind", "0.0.0.0:5328", "--workers=2", "--timeout=120"]