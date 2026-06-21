.PHONY: install db-up db-down db-reset env migrate migrate-dev generate seed \
        setup dev-backend dev-frontend dev build

BACKEND = backend
FRONTEND = frontend

install:
	@echo "Instalando dependencias..."
	cd $(BACKEND) && bun install
	cd $(FRONTEND) && bun install

db-up:
	@echo "Levantando PostgreSQL..."
	cd $(BACKEND) && docker compose up -d
	@echo "Esperando a que PostgreSQL esté listo..."
	@sleep 3

db-down:
	cd $(BACKEND) && docker compose down

db-reset:
	cd $(BACKEND) && docker compose down -v && docker compose up -d
	@echo "Esperando a que PostgreSQL esté listo..."
	@sleep 3

env:
	@if [ ! -f $(BACKEND)/.env ]; then \
		cp $(BACKEND)/.env.example $(BACKEND)/.env; \
		echo "Creado $(BACKEND)/.env desde .env.example — revisa los valores antes de continuar"; \
	else \
		echo "$(BACKEND)/.env ya existe"; \
	fi
	@if [ ! -f $(FRONTEND)/.env.local ]; then \
		printf '%s\n' \
			"NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1" \
			"NEXTAUTH_SECRET=secret-for-dev-local-123456" \
			"NEXTAUTH_URL=http://localhost:3000" \
			> $(FRONTEND)/.env.local; \
		echo "Creado $(FRONTEND)/.env.local"; \
	else \
		echo "$(FRONTEND)/.env.local ya existe"; \
	fi

migrate:
	cd $(BACKEND) && npx prisma migrate deploy

migrate-dev:
	cd $(BACKEND) && npx prisma migrate dev

generate:
	cd $(BACKEND) && npx prisma generate

seed:
	cd $(BACKEND) && npx prisma db seed

setup: install env db-up migrate seed
	@echo "Setup completado. Ejecuta 'make dev' para iniciar la app."

dev:
	@echo "Iniciando backend (puerto 8000) y frontend (puerto 3000)..."
	@trap 'kill 0' EXIT; \
		cd $(BACKEND) && npm run dev & \
		cd $(FRONTEND) && npm run dev & \
		wait

dev-backend:
	cd $(BACKEND) && npm run dev

dev-frontend:
	cd $(FRONTEND) && npm run dev

build:
	cd $(FRONTEND) && npm run build
