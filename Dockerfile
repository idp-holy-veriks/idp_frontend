FROM node:18-alpine AS build
WORKDIR /app

# Copiază package.json și package-lock.json
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Adaugă variabilele de mediu pentru React
ARG REACT_APP_AUTH_SERVICE_URL
ARG REACT_APP_BACKEND_SERVICE_URL
ENV REACT_APP_AUTH_SERVICE_URL=$REACT_APP_AUTH_SERVICE_URL
ENV REACT_APP_BACKEND_SERVICE_URL=$REACT_APP_BACKEND_SERVICE_URL

# Copiază restul codului sursă
COPY . .

# Construiește aplicația
RUN npm run build

# A doua etapă, pentru servire cu Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
