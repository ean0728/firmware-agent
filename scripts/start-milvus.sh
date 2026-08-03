#!/usr/bin/env bash

set -euo pipefail

repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
volume_root="${VOLUME_ROOT:-D:/data/docker}"
export MINIO_USER="${MINIO_USER:-admin}"
export MINIO_PASSWORD="${MINIO_PASSWORD:-pwd123456}"

log() {
  echo "[milvus-up] $*"
}

require_container_on_network() {
  local container="$1"

  log "Checking $container is running on the milvus network"
  if [ "$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null || true)" != "true" ]; then
    echo "$container is not running. Run: make $container-up"
    exit 1
  fi

  if ! docker inspect -f '{{range $name, $_ := .NetworkSettings.Networks}}{{println $name}}{{end}}' "$container" | grep -qx 'milvus'; then
    echo "$container is not connected to the milvus network"
    exit 1
  fi
}

require_published_port() {
  local container="$1"
  local port="$2"

  log "Checking $container port $port"
  if ! docker port "$container" "$port/tcp" | grep -Eq ":$port$"; then
    echo "$container port $port is not published correctly"
    exit 1
  fi
}

ensure_dependency() {
  local container="$1"
  local compose_file="$2"
  local data_dir="$3"

  if [ "$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null || true)" = "true" ]; then
    log "$container is already running"
    return
  fi

  log "Starting $container"
  DOCKER_VOLUME_DIRECTORY="$data_dir" \
    docker compose -p "$container" -f "$repo_dir/$compose_file" up -d
}

log "Checking milvus network"
if ! docker network inspect milvus >/dev/null 2>&1; then
  log "Creating milvus network"
  docker network create milvus >/dev/null
fi

ensure_dependency etcd docker/etcd/docker-compose.yml "$volume_root/etcd"
ensure_dependency minio docker/minio/docker-compose.yml "$volume_root/minio"

require_container_on_network etcd
require_container_on_network minio

require_published_port minio 9000
require_published_port minio 9001

log "Starting Milvus and Attu with data directory: $volume_root/milvus"
DOCKER_VOLUME_DIRECTORY="$volume_root/milvus" \
  docker compose -p milvus -f "$repo_dir/docker/milvus/docker-compose.yml" up -d

require_container_on_network milvus-standalone
require_container_on_network milvus-attu
require_published_port milvus-standalone 19530
require_published_port milvus-standalone 9091
require_published_port milvus-attu 3000

log "Waiting for Milvus to connect to etcd and minio"
for attempt in $(seq 1 30); do
  if docker exec milvus-standalone curl -fsS http://etcd:2379/health >/dev/null 2>&1 \
    && docker exec milvus-standalone curl -fsS http://minio:9000/minio/health/live >/dev/null 2>&1 \
    && docker exec milvus-standalone curl -fsS http://localhost:9091/healthz >/dev/null 2>&1; then
    log "Milvus and Attu are ready"
    cat <<'EOF'

Access:
  Attu:              http://localhost:3000 (create a local admin account on first visit)
  Milvus WebUI:      http://localhost:9091/webui/ (no login configured)
  Milvus gRPC:       localhost:19530 (no authentication configured)
  MinIO Console:     http://localhost:9001
  MinIO S3 API:      http://localhost:9000
  MinIO credentials: ${MINIO_USER} / ${MINIO_PASSWORD}
EOF
    exit 0
  fi
  sleep 2
done

echo "Milvus could not connect to etcd or minio, or its health endpoint is unavailable"
exit 1
