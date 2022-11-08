# FROM youngseon/pororo:0.3.1
FROM python:3.6.7

WORKDIR /usr/src/flask_app
COPY requirements.txt .
RUN python -m pip install --upgrade pip \
pip install --no-cache-dir -r requirements.txt

