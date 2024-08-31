FROM python:3.10-alpine AS builder

WORKDIR /app

COPY  . /app 

RUN --mount=type=cache,target=/root/.cache/pip \
  pip3 install -r requirements.txt

EXPOSE 5000

ENTRYPOINT [ "python3" ]
CMD [ "app.py" ]
