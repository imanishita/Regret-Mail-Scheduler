FROM maven:3.9.9-amazoncorretto-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/regret-mail-scheduler-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080 587
ENTRYPOINT ["java", "-jar", "app.jar"]