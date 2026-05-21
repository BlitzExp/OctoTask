#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(pwd)"
NAMESPACE="${NAMESPACE:-mtdrworkshop}"

DEPLOYMENT_NAME="todolistapp-springboot-deployment"
TEMPLATE_FILE="src/main/resources/todolistapp-springboot.yaml"
GENERATED_CONFIGMAP_FILE="/tmp/todolistapp-env.generated"

CONFIGMAP_NAME="todolistapp-env"

if [ ! -f "${TEMPLATE_FILE}" ]; then
    echo "Error: template file not found: ${TEMPLATE_FILE}"
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
    echo "Error: DOCKER_REGISTRY env variable needs to be set!"
    echo "Example:"
    echo "  export DOCKER_REGISTRY=mx-queretaro-1.ocir.io/axazeziwzv4z/octotask/nl6on"
    exit 1
fi

echo "Using namespace: ${NAMESPACE}"

kubectl get namespace "${NAMESPACE}" >/dev/null 2>&1 || {
    echo "Namespace ${NAMESPACE} does not exist. Creating it..."
    kubectl create namespace "${NAMESPACE}"
}

if [ -f ".env" ]; then
    echo "Creating/updating ConfigMap ${CONFIGMAP_NAME} from .env..."

    cp .env "${GENERATED_CONFIGMAP_FILE}"

    # Optional fallback: if OCI_REGION is not in .env, try to add it from state.
    if ! grep -q '^OCI_REGION=' "${GENERATED_CONFIGMAP_FILE}" && command -v state_get >/dev/null 2>&1; then
        OCI_REGION_FROM_STATE="$(state_get REGION || true)"
        if [ -n "${OCI_REGION_FROM_STATE}" ]; then
            echo "OCI_REGION=${OCI_REGION_FROM_STATE}" >> "${GENERATED_CONFIGMAP_FILE}"
            echo "Added OCI_REGION from state_get to generated ConfigMap input."
        fi
    fi

    # Optional fallback: if UI_USERNAME is not in .env, try to add it from state.
    if ! grep -q '^UI_USERNAME=' "${GENERATED_CONFIGMAP_FILE}" && command -v state_get >/dev/null 2>&1; then
        UI_USERNAME_FROM_STATE="$(state_get UI_USERNAME || true)"
        if [ -n "${UI_USERNAME_FROM_STATE}" ]; then
            echo "UI_USERNAME=${UI_USERNAME_FROM_STATE}" >> "${GENERATED_CONFIGMAP_FILE}"
            echo "Added UI_USERNAME from state_get to generated ConfigMap input."
        fi
    fi

    kubectl create configmap "${CONFIGMAP_NAME}" \
        --from-env-file="${GENERATED_CONFIGMAP_FILE}" \
        -n "${NAMESPACE}" \
        --dry-run=client -o yaml | kubectl apply -f -
else
    echo "Warning: no .env file found."
    echo "The application will only receive variables explicitly defined in the YAML."
fi

CURRENTTIME="$(date '+%Y%m%d-%H%M%S')"
GENERATED_FILE="${SCRIPT_DIR}/todolistapp-springboot-${CURRENTTIME}.yaml"

echo "Creating Spring Boot deployment and service manifest:"
echo "  ${GENERATED_FILE}"

sed \
    -e "s|%DOCKER_REGISTRY%|${DOCKER_REGISTRY}|g" \
    "${TEMPLATE_FILE}" > "${GENERATED_FILE}"

echo "Applying Kubernetes manifest..."

if [ -z "${1:-}" ]; then
    kubectl apply -f "${GENERATED_FILE}" -n "${NAMESPACE}"
else
    kubectl apply -f <(istioctl kube-inject -f "${GENERATED_FILE}") -n "${NAMESPACE}"
fi

echo "Waiting for rollout..."
kubectl rollout status deployment/"${DEPLOYMENT_NAME}" -n "${NAMESPACE}" || true

echo "Current resources:"
kubectl get all -n "${NAMESPACE}"