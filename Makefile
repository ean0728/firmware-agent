.PHONY: milvus-network-up etcd-up minio-up milvus-up

VOLUME_ROOT ?= D:/data/docker
MINIO_USER ?= admin
MINIO_PASSWORD ?= pwd@123456

milvus-network-up:
	docker network inspect milvus >/dev/null 2>&1 || docker network create milvus

etcd-up: milvus-network-up
	DOCKER_VOLUME_DIRECTORY="$(VOLUME_ROOT)/etcd" docker compose -p etcd -f docker/etcd/docker-compose.yml up -d

minio-up: milvus-network-up
	MINIO_USER="$(MINIO_USER)" MINIO_PASSWORD="$(MINIO_PASSWORD)" DOCKER_VOLUME_DIRECTORY="$(VOLUME_ROOT)/minio" docker compose -p minio -f docker/minio/docker-compose.yml up -d

milvus-up:
	VOLUME_ROOT="$(VOLUME_ROOT)" MINIO_USER="$(MINIO_USER)" MINIO_PASSWORD="$(MINIO_PASSWORD)" bash scripts/start-milvus.sh
