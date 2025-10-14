# Multi-stage build dla Spring Boot backend
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN groupadd -r taskflow && useradd -r -g taskflow taskflow

WORKDIR /app

COPY --from=build /app/target/taskflow-backend-1.0.0.jar app.jar

RUN chown -R taskflow:taskflow /app

USER taskflow

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
