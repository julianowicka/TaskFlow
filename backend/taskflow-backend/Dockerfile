# Multi-stage build dla Spring Boot backend
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie plików Maven
COPY pom.xml .
COPY src ./src

# Budowanie aplikacji
RUN mvn clean package -DskipTests

# Stage produkcyjny
FROM eclipse-temurin:17-jre

# Instalacja curl dla health check
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Tworzenie użytkownika nie-root
RUN groupadd -r taskflow && useradd -r -g taskflow taskflow

# Ustawienie katalogu roboczego
WORKDIR /app

# Kopiowanie JAR z build stage
COPY --from=build /app/target/taskflow-backend-1.0.0.jar app.jar

# Zmiana właściciela plików
RUN chown -R taskflow:taskflow /app

# Przełączenie na użytkownika nie-root
USER taskflow

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

# Uruchomienie aplikacji
ENTRYPOINT ["java", "-jar", "app.jar"]
