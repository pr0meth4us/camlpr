#!/bin/bash

# Stop and remove any existing container
docker rm -f camlpr 2>/dev/null || true

# Build the Docker image
# Using buildx to handle ARM64/AMD64 compatibility
docker buildx build --platform linux/$(uname -m) -t pr0meth4us/camlpr:latest .

# Run the container with resource limits
docker run -d \
  --name camlpr \
  --restart unless-stopped \
  -p 5328:5328 \
  --memory=1g \
  --memory-swap=1g \
  --cpus=1 \
  -e GUNICORN_CMD_ARGS="--workers=1 --worker-class=sync --worker-tmp-dir=/dev/shm --max-requests=100 --max-requests-jitter=50 --timeout=120" \
  pr0meth4us/camlpr:latest

# Check if container started successfully
sleep 5
docker ps | grep camlpr

echo "Container logs:"
docker logs camlpr