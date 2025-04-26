# Stage de build
FROM node:18-alpine AS build

WORKDIR /app

# Copierea fișierelor de dependințe
COPY package.json package-lock.json* ./

# Instalarea dependințelor
RUN npm ci || npm install

# Copierea codului sursă
COPY . .

# Construirea aplicației 
RUN npm run build

# Stage de producție cu Nginx
FROM nginx:alpine

# Copierea fișierelor build din stage-ul anterior
COPY --from=build /app/build /usr/share/nginx/html

# Configurare Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expunerea portului
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
