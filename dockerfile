FROM node:20 AS build
ARG VITE_API_URL=https://daysrodrigo.com
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN VITE_API_URL=${VITE_API_URL}  npm run build

FROM nginx:alpine
# Copiar configuração SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN apk update && apk upgrade
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
