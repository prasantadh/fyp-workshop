FROM node:lts AS development 

ENV CI=true
ENV PORT=3000
ENV HOST=0.0.0.0

WORKDIR /code

COPY . /code

RUN npm ci

CMD ["npm", "start"]
