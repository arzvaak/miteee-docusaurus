FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Asia/Kolkata

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends cron ca-certificates tzdata \
  && rm -rf /var/lib/apt/lists/*

COPY requirements-ssc.txt /tmp/requirements-ssc.txt
RUN python -m pip install --no-cache-dir -r /tmp/requirements-ssc.txt

COPY ops/netcup/ssc-cgl-news.cron /etc/cron.d/ssc-cgl-news
RUN chmod 0644 /etc/cron.d/ssc-cgl-news && crontab /etc/cron.d/ssc-cgl-news

CMD ["cron", "-f"]
