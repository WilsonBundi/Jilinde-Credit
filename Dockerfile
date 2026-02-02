# Multi-stage build for Railway deployment
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
COPY frontend/.npmrc ./
RUN npm ci --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Java backend stage
FROM openjdk:17-jdk-slim AS backend-build

# Install Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Build backend
WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/src ./src

# Copy frontend build to backend static resources
COPY --from=frontend-build /app/frontend/build ./src/main/resources/static

# Build backend
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Expose port
EXPOSE $PORT

# Run the application
CMD ["sh", "-c", "java -Dserver.port=$PORT -jar app.jar"]