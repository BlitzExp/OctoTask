#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-todolistapp-springboot}"

# Keep this as 0.1 because your Kubernetes YAML uses :0.1.
IMAGE_VERSION="${IMAGE_VERSION:-0.1}"

GIT_TAG="$(git rev-parse --short HEAD)"

# Use podman in OCI Cloud Shell, docker elsewhere.
if command -v podman >/dev/null 2>&1; then
    CONTAINER_CLI="${CONTAINER_CLI:-podman}"
elif command -v docker >/dev/null 2>&1; then
    CONTAINER_CLI="${CONTAINER_CLI:-docker}"
else
    echo "Error: neither podman nor docker is installed."
    exit 1
fi

if [ -z "${DOCKER_REGISTRY:-}" ]; then
    if command -v state_get >/dev/null 2>&1; then
        DOCKER_REGISTRY="$(state_get DOCKER_REGISTRY || true)"
        export DOCKER_REGISTRY
        echo "DOCKER_REGISTRY set from state."
    fi
fi

if [ -z "${DOCKER_REGISTRY:-}" ]; then
    echo "Error: DOCKER_REGISTRY env variable needs to be set."
    echo "Example:"
    echo "  export DOCKER_REGISTRY=mx-queretaro-1.ocir.io/axazeziwzv4z/octotask/nl6on"
    exit 1
fi

IMAGE="${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_VERSION}"
GIT_IMAGE="${DOCKER_REGISTRY}/${IMAGE_NAME}:${GIT_TAG}"

echo "Building Java app..."
mvn clean package -DskipTests

if ! ls target/*.jar >/dev/null 2>&1; then
    echo "Error: no JAR found in target/."
    exit 1
fi

echo "Building container image:"
echo "  ${IMAGE}"
"${CONTAINER_CLI}" build -f Dockerfile -t "${IMAGE}" .

echo "Also tagging image with git SHA:"
echo "  ${GIT_IMAGE}"
"${CONTAINER_CLI}" tag "${IMAGE}" "${GIT_IMAGE}"

echo "Pushing image:"
echo "  ${IMAGE}"
"${CONTAINER_CLI}" push "${IMAGE}"

echo "Pushing git-tagged image:"
echo "  ${GIT_IMAGE}"
"${CONTAINER_CLI}" push "${GIT_IMAGE}"

echo "Cleaning local images to save Cloud Shell space..."
"${CONTAINER_CLI}" rmi "${IMAGE}" "${GIT_IMAGE}" || true

echo "Build and push completed successfully."
echo "Main image: ${IMAGE}"
echo "Git image:  ${GIT_IMAGE}"