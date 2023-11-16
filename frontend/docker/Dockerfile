# syntax=docker/dockerfile:1
FROM node:12 AS frontendStaticBuilder
LABEL maintainer="Philip Hofmann, philip.hofmann@ius.uzh.ch"
RUN git clone https://gitlab.com/rwf-dev-public/timeline.git
WORKDIR /timeline/frontend/
RUN npm install
RUN mkdir dist
RUN npm run build
RUN cp dist/timeline.js static/timeline.js
RUN cp dist/index.html static/desktop.html
RUN cp dist/68ad89bdda1a63e5f8d64e8e4109cd40.json static/68ad89bdda1a63e5f8d64e8e4109cd40.json

FROM nginx:alpine
COPY --from=frontendStaticBuilder /timeline/frontend/static/ /usr/share/nginx/html/