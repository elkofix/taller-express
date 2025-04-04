# Taller express
-Alejandro Cordoba A00395678
-Isabella Ocampo A00382369
-Valentina González A00394152
## Descripción
En este taller se encuentra un sistema de eventos llamado Ticktopia, en el cual usuarios pueden comprar boletos de eventos disponibles para asi asistir a estos. Ademas los organizadores de los eventos pueden registrarlos para asi comercializarlos.

## Rutas
- auth/login - Los usuarios se loguean en esta ruta, aqui pueden entrar los usuarios, el event manager y el superadmin. 
- events/ - muestra todos los eventos disponibles en el momento.
- events/findEvent/:id - aqui se encuentra un evento en especifico dado por su id.
- events/findAllById/:userId - aqui se encuentra todos los eventos 
- events/create - aqui se puede crear los eventos bajo autorización del event manager o superadmin
- event/update/:id - aqui se puede editar un evento bajo autorizacion
- events/delete/:id - aqui se eliminar un evento bajo autorizacion
-ticket/buy - Aqui un usuario puede comprar un ticket 
- ticket/user/:userId - Aqui se pueden ver boletos comprados por un usuario
- tickets/:ticketId - Aqui se pueden ver todos los detalles de un solo boleto
- ticket/:ticketId - Aqui se puede cancelar un ticket bajo autorización 



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