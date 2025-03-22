Write-Host "Verificando si Docker está corriendo..."

# Verificar si Docker está ejecutándose correctamente
$dockerStatus = docker info --format '{{.ServerVersion}}' 2>$null

if (-not $dockerStatus) {
    Write-Host "Docker no está corriendo o no responde. Intentando iniciarlo..."
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe" -NoNewWindow
    Write-Host "Esperando a que Docker inicie..."

    # Esperar hasta que Docker esté completamente listo
    do {
        Start-Sleep -Seconds 2
        $dockerStatus = docker info --format '{{.ServerVersion}}' 2>$null
    } until ($dockerStatus)

    Write-Host "Docker está listo."
} else {
    Write-Host "Docker ya está corriendo."
}

# Verificar si MongoDB está corriendo
Write-Host "Verificando si MongoDB está corriendo..."
$mongoRunning = docker ps --format "{{.Names}}" | Select-String "mongo" -Quiet

if (-not $mongoRunning) {
    Write-Host "MongoDB no está corriendo. Levantándolo..."
    docker-compose -f mongo-db/dc-mongodb.yml up -d
    Start-Sleep -Seconds 5
} else {
    Write-Host "MongoDB ya está corriendo."
}

# Guardar la ubicación actual
$originalPath = Get-Location

try {
    # Iniciar la aplicación Express
    Write-Host "Iniciando la aplicación Express..."

    # Moverse a la carpeta donde está package.json
    Set-Location -Path "$PSScriptRoot\express"

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
}
finally {
    # Restaurar la ubicación original
    Set-Location -Path $originalPath
}
