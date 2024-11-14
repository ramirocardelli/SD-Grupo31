Bruno Trinitario
Ramiro Cardelli
Josefina Frasca Ponce
Juan Ignacio Olave

##Tech stack:

#Backend:
Node JS
Vanilla JS
Arduino
Librerias: 
   - cors
   - express
   - jsonwebtoken
   - mqtt

#Frontend:
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
   - Ejecutar la api `node index.js`
   - sobre la ruta de clonacion ir a ./frontend/api e instalar dependecias `npm install`
   - Ejecutar el frontend `node index.js`
   - acceder al front mediante un navegador en la ruta `http://localhost:3001`
