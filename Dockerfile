FROM --platform=linux/amd64 python:3.11-slim AS builder

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

# Install everything with extra index for PyTorch CPU wheels
RUN pip install --upgrade pip \
 && pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt \
 && pip install --no-cache-dir ./wheels/strhub-*.whl \
 && rm -rf /root/.cache/pip

# Final slim image
FROM --platform=linux/amd64 python:3.11-slim

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

# Copy model files and application code
COPY api/models/ ./models/
COPY api/ ./api/

# Set user for better security
RUN useradd -m appuser
USER appuser

EXPOSE 5328

# Reduce number of workers and add memory-related configurations
ENV GUNICORN_CMD_ARGS="--workers=2 --worker-class=sync --worker-tmp-dir=/dev/shm --max-requests=1000 --max-requests-jitter=50 --timeout=120"

CMD ["gunicorn", "api.app:app", "-b", "0.0.0.0:5328"]