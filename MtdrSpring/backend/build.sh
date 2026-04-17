#!/bin/bash

export IMAGE_NAME=todolistapp-springboot
export IMAGE_VERSION=0.1

if [ -z "$DOCKER_REGISTRY" ]; then
    export DOCKER_REGISTRY=$(state_get DOCKER_REGISTRY)
    echo "DOCKER_REGISTRY set."
fi
if [ -z "$DOCKER_REGISTRY" ]; then
    echo "Error: DOCKER_REGISTRY env variable needs to be set!"
    exit 1
fi

export IMAGE=${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}
export OCIR_HOST=$(echo "$DOCKER_REGISTRY" | cut -d'/' -f1)

mvn clean package spring-boot:repackage
docker build -f Dockerfile -t $IMAGE .

echo "Login to OCIR host: $OCIR_HOST"
docker login "$OCIR_HOST"

docker push $IMAGE
if [ $? -eq 0 ]; then
    docker rmi "$IMAGE"
fi