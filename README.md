Bruno Trinitario

Ramiro Cardelli

Josefina Frasca Ponce

Juan Ignacio Olave

# Tech stack:

## Backend:

Vainilla JS

Arduino

jsonwebtoken, para gestionar los JWT

nodemon, para demonizar el proceso y contar con hot reload ante modificaciones en los archivos

## Frontend:

Axios, para requests HTTP.

Vanilla JS, HTML y CSS

# Requerimientos:

- Docker y Docker Compose
- Node.js v20 o superior

Instrucciones para ejecutar el proyecto:

1. Levantar broker Mosquitto:

   - Navegar a la carpeta SD-Grupo31 configurar Docker con el archivo docker-compose.yml ejecutando por consola:
   - docker-compose up
   - Iniciar mosquitto-broker desde docker

2. Levantar servidor backend:

   - Iniciar tp-distribuidos desde docker

3. Levantar servidor Frontend:

   - Navegar hasta SD-Grupo31/Frontend/api
   - ejecutar por consola:
     - npm i
     - npm start

4. Abrir desde el navegador https://localhost:3000/ para poder visualizar el frontend
