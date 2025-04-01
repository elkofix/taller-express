    #!/bin/bash

    echo "Verificando si Docker está instalado..."

    # Verificar si Docker está instalado
    if ! command -v docker &>/dev/null; then
        echo "Docker no está instalado. Por favor, instálelo antes de continuar."
        exit 1
    fi

    echo "Verificando si Docker está corriendo..."


    # Guardar la ubicación actual
    original_path=$(pwd)

    # Iniciar la aplicación Express
    echo "Iniciando la aplicación Express..."

    # Moverse a la carpeta donde está package.json
    cd "$(dirname "$0")" || exit

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