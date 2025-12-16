# Multi-stage build dla Angular frontend
FROM node:20-alpine AS build

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm ci --omit=dev --ignore-scripts

# Kopiowanie kodu źródłowego
COPY . .

# Budowanie aplikacji dla produkcji
RUN npm run build

# Stage produkcyjny z Nginx
FROM nginx:alpine

# Kopiowanie zbudowanej aplikacji
COPY --from=build /app/dist/taskflow/browser /usr/share/nginx/html

# Kopiowanie konfiguracji Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Uruchomienie Nginx
CMD ["nginx", "-g", "daemon off;"]
