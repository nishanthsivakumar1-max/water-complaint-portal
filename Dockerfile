# Stage 0: Build React Frontend
FROM node:18 AS frontend-build
WORKDIR /app/frontend
COPY water-portal-frontend/package*.json ./
RUN npm install
COPY water-portal-frontend/ ./
RUN npm run build

# Stage 1: Build Spring Boot Backend with Maven
FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /app/backend
COPY demo/.mvn .mvn
COPY demo/mvnw demo/pom.xml ./
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY demo/src ./src
# Copy the built React files directly into Spring Boot's static resources
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN ./mvnw clean package -DskipTests

# Stage 2: Run the Application
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]