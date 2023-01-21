build.calc-shared:
	docker compose build calc-shared

build.calc-worker: build.calc-shared
	docker compose build calc-worker

build.calc-api: build.calc-shared
	docker compose build calc-api

build: build.calc-worker build.calc-api
	@true
