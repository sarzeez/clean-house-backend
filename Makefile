DOCKER_COMPOSE_FILE ?= docker-compose.yaml

start:
	@echo "Start Containers"
	docker-compose -f ${DOCKER_COMPOSE_FILE} up -d ${DOCKER_SERVICES}
	sleep 2
	docker-compose -f ${DOCKER_COMPOSE_FILE} ps

stop:
	@echo "Stop Containers"
	docker-compose -f ${DOCKER_COMPOSE_FILE} stop ${DOCKER_SERVICES}
	sleep 2
	docker-compose -f ${DOCKER_COMPOSE_FILE} ps

rm: stop
	@echo "Remove Containers"
	docker-compose -f ${DOCKER_COMPOSE_FILE} rm -v -f ${DOCKER_SERVICES}

restart: stop start

install:
	@echo "Install Dependencies"
	docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app bash -c 'yarn install'

migration-up:
	@echo "Run migrations"
	docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app bash -c 'npm run typeorm:run-migrations'

migration-down:
	@echo "Revert last migration"
	docker-compose -f ${DOCKER_COMPOSE_FILE} exec -T app bash -c 'npm run typeorm:revert-migration'