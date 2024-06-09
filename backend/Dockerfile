FROM python:3.9
WORKDIR /app

COPY . .

RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir aiohttp
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

WORKDIR /app/ecms

CMD python manage.py runserver 0.0.0.0:8000