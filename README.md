# Taller express

## Prerequistos

Debes tener instaladas las siguientes herramientas para poder ejecutar el proyecto

- Docker


- git

<a href="https://docs.docker.com/get-started/get-docker/"><image src="https://www.docker.com/app/uploads/2023/05/symbol_blue-docker-logo.png" alt="Descripción de la imagen"  width="70" height="50"></a>
<a href="https://git-scm.com/downloads"><image src="https://res.cloudinary.com/dnmlo67cy/image/upload/v1742749307/g0mrk9y10tod6vndxlog.png" alt="Descripción de la imagen"  width="50" height="50"></a>


## Pasos para ejecutar el proyecto

1. Asegurate de que docker este corriendo

2. Asegurate de que el puerto 3000 este disponibles, si no, este comando fallará

3. En tu consola, dirigete a la carpeta en donde deseas clonar el repositorior

4. Clona el repositorio con el siguiente comando:

```sh
git clone https://github.com/elkofix/taller-express.git
```

5. Una vez se termine de clonar el repositorio, muevete a la carpeta del proyecto con el siguiente comando:

```sh
cd taller-express
```

6. Para ejecutar el proyecto debes ejecutar el siguiente comando:

```sh
docker run --rm -it -p 3000:3000 $(docker build -q -t mi-app .)
```