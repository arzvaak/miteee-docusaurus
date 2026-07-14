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
COPY scripts/daily_news_pipeline.py scripts/run_ssc_cgl_daily_news_once.sh ./scripts/
RUN sed -i 's/\r$//' /etc/cron.d/ssc-cgl-news scripts/daily_news_pipeline.py scripts/run_ssc_cgl_daily_news_once.sh \
  && chmod 0644 /etc/cron.d/ssc-cgl-news \
  && crontab /etc/cron.d/ssc-cgl-news \
  && chmod 0755 scripts/run_ssc_cgl_daily_news_once.sh \
  && mkdir -p /app/data/current-affairs/logs

CMD ["cron", "-f"]
