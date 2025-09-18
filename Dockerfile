# -------- Stage 1: Build the application --------
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy build configuration and wrapper
COPY .mvn .mvn
COPY mvnw pom.xml ./

# Download dependencies (cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the app (skip tests to speed up production build)
RUN ./mvnw clean package -DskipTests

# -------- Stage 2: Run the application --------
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the built jar from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Railway assigns the port dynamically, so we respect the PORT env variable
ENV PORT=8080
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"]
