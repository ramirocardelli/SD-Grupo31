Bruno Trinitario

Ramiro Cardelli

Josefina Frasca Ponce

Juan Ignacio Olave

# Tech stack:

#Backend:
Node JS
Vanilla JS
Arduino
Librerias:

- cors
- express
- jsonwebtoken
- mqtt

# Frontend:

Vanilla JS
HTML
CSS
Librerias:

- Axios
- bcrypt
- cors
- express
- jsonwebtoken
- Leaflet

Instrucciones para ejecutar el proyecto (con docker):

Requisitos:

- Docker

1. Clonar el repositorio
   - git clone https://github.com/ramirocardelli/SD-Grupo31
2. Correr el proyecto en docker
   - Dirigirnos a la ruta donde se clono el repositorio
   - ejecutar sobre la ruta el comando `docker compose up`

Instrucciones para ejecutar el proyecto (con node):

Requisitos:

- Node

1. Clonar el repositorio
   - git clone https://github.com/ramirocardelli/SD-Grupo31

2. Correr el proyecto con node
   - Dirigirnos a la ruta donde se clono el repositorio
   - sobre la ruta de clonacion ir a ./backend e instalar dependecias `npm install`
   - Ejecutar la API vanilla `node index.js` o la API express `node server.js`
   - sobre la ruta de clonacion ir a ./frontend/api e instalar dependecias `npm install`
   - Ejecutar el frontend `node index.js`
   - acceder al front mediante un navegador en la ruta `http://localhost:3001`

Configuracion:

1. Configuracion de puertos para API y FRONTEND con NODE
   - Dentro de la ruta `./backend` existe un archivo llamado `.env` el cual tiene los puertos donde se ejecutaran diferentes modulos de la API siendo:
      - PORT el puerto para la API vanilla

2. Configuracion de puertos en DOCKER 
   ** Se recomienda no cambiar los puertos de las carpetas `.env` si se va a ejecutar el proyecto en docker, solo mapear **
   - Si se decidiera ejecutar el proyecto en docker se puede mapear los puertos de docker y la computadora HOST
      - Sobre la ruta raiz del proyecto, en el archivo `docker-compose.yml` se pueden encontrar los difrentes servicios `backend`, `frontend` y `mosquitto` cada apartado tiene una seccion de `servicios` donde se ve el mapeo `[Puerto_HOST]:[Puerto_aplicacion_docker]`.
         - `Puertos_HOST` son los puertos que la computadora que contiene el proyecto ejecutado 
3. Configuracion de tipo de API para docker
   - Para elegir que API ejecutar en docker (sea vanilla o express) de debe ir a `./backend` abrir el archivo `Dockerfile` y en la linea `CMD` cambiar `index.js` por `server.js` si se quisiera la API express.

Flujo de la aplicacion:

- El usuario `admin` utiliza la constraseña `admin`.
- Metodos permitidos + endpoints de la API
   - [PATCH] [DELETE] IP/API/animals/:id
   - [GET] [POST] IP/API/animals/
   - [GET] IP/API/animals/position/
   - [PATCH] [DELETE] IP/API/checkpoints/:id
   - [GET] [POST] IP/API/checkpoints/
   - [POST] IP/API/login/
   - [POST] IP/API/refresh/
   - [GET] IP/API/availableDevices/
- La respuesta a cada peticion se encuentra en el documento definido por `la catedra`
- Arquitectura
- Codigos de error
   - `400`: Ausencia de datos para llevar a cabo una request 
   - `401`: No existe el token, contraseña invalida
   - `403`: Token existente pero erróneo 
   - `404`: Falla en encontrar una ruta/ el contenido solicitado
   - `500`: Falla en el servidor
