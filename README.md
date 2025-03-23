# Taller express

## Prerequistos

Debes tener instaladas las siguientes herramientas para poder ejecutar el proyecto

- Docker

- Docker Compose

- git

<a href="https://docs.docker.com/get-started/get-docker/"><image src="https://www.docker.com/app/uploads/2023/05/symbol_blue-docker-logo.png" alt="Descripción de la imagen"  width="70" height="50"></a><a href="https://docs.docker.com/get-started/get-docker/"><image src="https://res.cloudinary.com/dnmlo67cy/image/upload/v1742749586/st6esl0gcbcnrplvtyzy.png" alt="Descripción de la imagen"  width="70" height="50"></a>
<a href="https://git-scm.com/downloads"><image src="https://res.cloudinary.com/dnmlo67cy/image/upload/v1742749307/g0mrk9y10tod6vndxlog.png" alt="Descripción de la imagen"  width="50" height="50"></a>


## Pasos para ejecutar el proyecto

1. En tu consola, dirigete a la carpeta en donde deseas clonar el repositorior

2. Clona el repositorio con el siguiente comando:

```sh
git clone https://github.com/elkofix/taller-express.git
```

3. Una vez se termine de clonar el repositorio, muevete a la carpeta del proyecto con el siguiente comando:

```sh
cd taller-express
```

4. Para ejecutar el proyecto debes ejecutar el siguiente comando:

```sh
docker-compose up --build
```

Asegurate de que los puertos 3000 y 27017 esten disponibles, si no, este comando fallará