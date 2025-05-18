#!/bin/bash
set -e

# Log startup
echo "$(date -u): Starting application..."

# For Koyeb compatibility - use PORT env var if available
export PORT=${PORT:-5328}
echo "$(date -u): Configured to listen on port $PORT"

# Check for required directories
for dir in models api app; do
  if [ ! -d "/$dir" ] && [ ! -d "/app/$dir" ]; then
    echo "WARNING: Directory $dir not found, this might cause issues!"
  fi
done

# Configure memory settings for ML workloads
echo "$(date -u): Configuring memory settings..."
export MALLOC_ARENA_MAX=1
export OMP_NUM_THREADS=1
export MKL_NUM_THREADS=1
export PYTHONUNBUFFERED=1
export PYTORCH_NO_CUDA_MEMORY_CACHING=1

# Check for CUDA availability
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}')"

# Optional: Pre-download models if needed
# echo "$(date -u): Pre-downloading model files if needed..."
# python -m app.models.download

# Start the application with proper error handling
echo "$(date -u): Starting uvicorn server..."
exec uvicorn api.asgi:asgi_app \
  --host 0.0.0.0 \
  --port $PORT \
  --workers 1 \
  --log-level info \
  --timeout-keep-alive 75 \
  --limit-concurrency 10