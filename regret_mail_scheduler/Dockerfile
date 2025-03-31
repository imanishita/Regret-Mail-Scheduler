FROM maven:3.9.9-amazoncorretto-21 AS builder
WORKDIR /build
# Copy only what's needed for dependency resolution
COPY regret_mail_scheduler/pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY regret_mail_scheduler/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
# Wildcard copy to handle any version number
COPY --from=builder /build/target/*.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]