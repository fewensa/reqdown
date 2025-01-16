FROM node:21-alpine

COPY . /app

RUN cd /app \
    && yarn install \
    && mkdir /data

WORKDIR /app

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
