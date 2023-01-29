build.calc-shared:
	docker compose build calc-shared

build.calc-worker: build.calc-shared
	docker compose build calc-worker

build.calc-api: build.calc-shared
	docker compose build calc-api

build: build.calc-worker build.calc-api
	@true

clean: stop clean.volumes start.db migrate start

clean.volumes:
	docker volume rm calc-event-sourcing_pg-data -f
	docker volume rm calc-event-sourcing_eventstore-volume-data -f
	docker volume rm calc-event-sourcing_eventstore-volume-logs -f

stop:
	docker compose down

start:
	docker compose up -d --wait calc-api calc-worker

start.db:
	docker compose up -d --wait pg.db

migrate:
	cd calc-api; npx prisma migrate dev