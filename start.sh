    #!/bin/bash

    echo "Verificando si Docker está instalado..."

    # Verificar si Docker está instalado
    if ! command -v docker &>/dev/null; then
        echo "Docker no está instalado. Por favor, instálelo antes de continuar."
        exit 1
    fi

    echo "Verificando si Docker está corriendo..."

    # Verificar si Docker está ejecutándose
    if ! docker info &>/dev/null; then
        echo "Docker no está corriendo. Intentando iniciarlo..."
        open --background -a "Docker"
        echo "Esperando a que Docker inicie..."

        # Esperar hasta que Docker esté completamente listo
        while ! docker info &>/dev/null; do
            sleep 2
        done

        echo "Docker está listo."
    else
        echo "Docker ya está corriendo."
    fi

    # Verificar si MongoDB está corriendo
    echo "Verificando si MongoDB está corriendo..."
    if ! docker ps --format "{{.Names}}" | grep -q "mongo"; then
        echo "MongoDB no está corriendo. Levantándolo..."
        docker-compose -f mongo-db/dc-mongodb.yml up -d
        sleep 5
    else
        echo "MongoDB ya está corriendo."
    fi

    # Guardar la ubicación actual
    original_path=$(pwd)

    # Iniciar la aplicación Express
    echo "Iniciando la aplicación Express..."

    # Moverse a la carpeta donde está package.json
    cd "$(dirname "$0")/express" || exit

    # Verificar si las dependencias de npm están instaladas
    if [ ! -d "node_modules" ]; then
        echo "No se encontraron dependencias de npm. Instalándolas..."
        npm install
    else
        echo "Las dependencias de npm ya están instaladas."
    fi

    # Ejecutar npm run dev dentro de express
    echo "Ejecutando la aplicación..."
    npm run dev

    # Restaurar la ubicación original
    cd "$original_path"
