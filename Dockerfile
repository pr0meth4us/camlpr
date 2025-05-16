FROM --platform=$BUILDPLATFORM python:3.11-slim AS builder

# Install build dependencies only in this stage
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Copy dependency specs and wheel
COPY requirements.txt .
COPY wheels/strhub-*.whl ./wheels/

# Install dependencies into a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install everything with extra index for PyTorch platform-specific wheels
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir ./wheels/strhub-*.whl \
    && rm -rf /root/.cache/pip

# Final slim image - use TARGETPLATFORM to handle both amd64 and arm64
FROM --platform=$TARGETPLATFORM python:3.11-slim

# Install only runtime dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    libgl1 \
    libsm6 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder stage
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Create a dedicated directory for YOLO config files
RUN mkdir -p /app/.config/Ultralytics \
    && chmod -R 777 /app/.config

# Set the YOLO config directory environment variable
ENV YOLO_CONFIG_DIR=/app/.config/Ultralytics

# Copy model files and application code
COPY api/models/ ./models/
COPY api/ ./api/

# Set user for better security
RUN useradd -m appuser
USER appuser

EXPOSE 5328

# Memory limits and optimization environment variables
ENV PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128
ENV OMP_NUM_THREADS=1
ENV MKL_NUM_THREADS=1

# Reduce number of workers and add memory-related configurations
ENV GUNICORN_CMD_ARGS="--workers=1 --worker-class=sync --worker-tmp-dir=/dev/shm --max-requests=100 --max-requests-jitter=50 --timeout=120"

CMD ["gunicorn", "api.app:app", "-b", "0.0.0.0:5328"]