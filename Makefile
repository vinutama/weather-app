build:
	docker compose build

run:
	docker compose up -d

down:
	docker compose down

logs-app:
	docker logs weather-app -f

logs-redis:
	docker logs weather-redis -f

prune:
	docker system prune -af --volumes

cnetwork:
	docker network create integrity

fresh-start:
	make down && \
	make prune && \
	make build && \
	make cnetwork && \
	make run