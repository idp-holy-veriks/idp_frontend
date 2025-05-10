FROM node:18-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./

RUN rm -rf node_modules
RUN npm ci --no-cache || npm install --no-cache

COPY . .

ARG REACT_APP_AUTH_SERVICE_URL
ARG REACT_APP_BACKEND_SERVICE_URL

ENV REACT_APP_AUTH_SERVICE_URL=$REACT_APP_AUTH_SERVICE_URL
ENV REACT_APP_BACKEND_SERVICE_URL=$REACT_APP_BACKEND_SERVICE_URL

RUN echo "React versions:" && npm list react react-dom

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]