# Build stage
FROM python:3.11-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY requirements.txt .
COPY wheels/strhub-*.whl ./wheels/

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --upgrade pip \
 && pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt \
 && pip install --no-cache-dir ./wheels/strhub-*.whl \
 && rm -rf /root/.cache/pip

# Runtime stage
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends libgl1 libsm6 libglib2.0-0 \
 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

RUN mkdir -p /app/.config/Ultralytics && chmod -R 777 /app/.config
ENV YOLO_CONFIG_DIR=/app/.config/Ultralytics

COPY api/models/ ./models/
COPY api/ ./api/

RUN useradd -m appuser
USER appuser

EXPOSE 5328

ENV PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:64
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1

ENV GUNICORN_CMD_ARGS="--workers=1 --worker-class=sync --worker-tmp-dir=/dev/shm --max-requests=50 --max-requests-jitter=10 --timeout=120"

CMD ["gunicorn", "api.app:app", "-b", "0.0.0.0:5328"]
