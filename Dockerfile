FROM python:3.11-slim

WORKDIR /app
COPY wheels/ /wheels/
COPY requirements.txt .

# Install packages without attempting to install Flask yet
RUN pip install --upgrade pip
RUN pip install --no-index --find-links=/wheels --no-deps -r requirements.txt
RUN pip install --no-index --find-links=/wheels gunicorn strhub

# copy models & code...
COPY api/models/ ./models/
COPY api/ ./api/

EXPOSE 5328
CMD ["gunicorn","api.app:app","-w","4","-b","0.0.0.0:5328"]