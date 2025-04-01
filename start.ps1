
    # Iniciar la aplicación Express
    Write-Host "Iniciando la aplicación Express..."

    # Moverse a la carpeta donde está package.json
    Set-Location -Path "$PSScriptRoot"

    # Verificar si las dependencias de npm están instaladas
    if (-not (Test-Path "node_modules")) {
        Write-Host "No se encontraron dependencias de npm. Instalándolas..."
        npm install
    } else {
        Write-Host "Las dependencias de npm ya están instaladas."
    }

    # Ejecutar npm run dev dentro de express
    Write-Host "Ejecutando la aplicación..."
    Start-Process "cmd.exe" -ArgumentList "/c npm run dev" -NoNewWindow -Wait
