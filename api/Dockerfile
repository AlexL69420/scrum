FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY manager/pom.xml .

RUN mvn dependency:go-offline
COPY manager/src ./src/
RUN mvn clean install -DskipTests

# Stage 2: Create the runtime image
FROM openjdk:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
