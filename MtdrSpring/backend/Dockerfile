FROM docker.io/eclipse-temurin:17-jre-jammy

WORKDIR /app

RUN useradd --system --uid 10001 appuser \
    && mkdir -p /mtdrworkshop/creds \
    && chown -R appuser /app /mtdrworkshop

ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} /app/MyTodoList.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/MyTodoList.jar"]


