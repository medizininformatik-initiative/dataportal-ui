### STAGE 1: Build ###
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /usr/src/app
COPY . .
RUN npm install
ARG ENVIRONMENT=deploy
RUN npm run build -- --configuration=${ENVIRONMENT}

### STAGE 2: Run ###
FROM ghcr.io/nginx/nginx-unprivileged:1.31.9-alpine
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist/num-portal-webapp /usr/share/nginx/html
