# Runtime Image
FROM python:3.11-slim-buster

# 1) Install minimal OS libraries with jemalloc
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libjemalloc2 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 2) Copy dependency definitions
COPY api/requirements.txt ./requirements.txt
COPY api/wheels/strhub-*.whl ./wheels/

# 3) Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir \
        --extra-index-url https://download.pytorch.org/whl/cpu \
        -r requirements.txt && \
    pip install --no-cache-dir uvloop httptools && \
    pip install --no-cache-dir --no-deps ./wheels/strhub-*.whl

# 4) Copy application code and models
COPY api/ ./api/
COPY api/app/ ./app/
COPY api/models/ ./models/
# (Add any other modules you need)

# 5) Set environment variables for memory optimization
ENV MALLOC_ARENA_MAX=1 \
    OMP_NUM_THREADS=1 \
    MKL_NUM_THREADS=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libjemalloc.so.2

# 6) Configure non-root user
RUN useradd -m appuser
USER appuser

EXPOSE 5328

# 7) Start Uvicorn with lean flags
CMD ["uvicorn", "api.asgi:asgi_app", \
     "--host", "0.0.0.0", "--port", "5328", \
     "--workers", "1", \
     "--loop", "uvloop", "--http", "httptools", \
     "--limit-concurrency", "5", \
     "--timeout-keep-alive", "10"]