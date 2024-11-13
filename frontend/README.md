**Martin Ignacio Casas**  

### Tech stack:
Backend:
- Express, para crear la API REST
- BCrypt, para hashear, almacenar y comparar contraseñas
- jsonwebtoken, para gestionar los JWT
- dotenv, para gestionar las variables de entorno
- nodemon, para demonizar el proceso y contar con hot reload ante modificaciones en los archivos.

Frontend:
- Axios, para requests HTTP.
- Vanilla JS, HTML y CSS

### Instrucciones para ejecutar el proyecto:

Node.js v20 o superior instalado.

0. Ir al directorio de la API, `cd api`
1. Ejecutar `npm install` para instalar las dependencias en el package.json
1. Ejecutar `npm run start` para correr el script "start" del package.json
3. Abrir un navegador web y acceder a `http://localhost:3000` para ver el frontend en acción

### Consideraciones de la API:
- El usuario almacenado utiliza la contraseña "password123".
- Arquitectura ruta, controlador, servicio
Las rutas son aquellos endpoints a los que la aplicacion puede responder. Representa una URL y un metodo HTTP (GET, PUT, POST, etc).
Los controladores son aquellas funciones encargadas del flujo de informacion entre el modelo (logica de negocio y base de datos) y la vista (aquello con lo que el usuario interactua). Basicamente, se encargan de procesar la request y enviarles una respuesta apropiada al usuario.
Los servicios son los responsables de la logica de negocio de la aplicacion. Aqui se definen las reglas, la logica y los calculos. Ademas, utiliza los repositorios para leer y manipular informacion.
Los repositorios actuan como una capa de abstraccion entre los servicios y la capa de acceso a la informacion. Se comunican directamente con las bases de datos y encapsulan la logica para acceder a ellas. Si se modificara la herramienta de base de datos, este enfoque permitira hacer el cambio facilmente, ademas de favorecer la mantenibilidad y escalabilidad.
- Se ha utilizado la libreria bcrypt para gestionar las contraseñas. De esta forma, las contraseñas se hashean antes de ser almacenadas.
Que implica hashear una contraseña?
El proceso de convertir una contraseña (un string) en otro string de longitud fija, para almacenarla de forma segura y transmitirla por medios inseguros. Los metodos de hash para contraseñas son "one-way" (de una direccion), es decir, es imposible revertir el proceso y obtener la contraseña original partiendo del valor hasheado.
Bcrypt, ademas de ser la dependencia aqui utilizada, es el nombre del algoritmo cryptografico. Combina hash y salting. Es decir, primero procesa el string original de la contraseña y lo convierte en otro de longitud fija, utilizando una funcion matematica. Luego, le aplica un numero random de saltos a cada contraseña, para complejizar el proceso aun mas (y para evitar ataques rainbow tables). El numero de salto se genera utilizado la funcion `bcrypt.genSalt()` y se utiliza luego para utilizar la funcion `bcrypt.hash()`.
Estas contraseñas almacenadas, se verifican luego utilizando la funcion `bcrypt.compare()` con la contraseña ingresada por el usuario. Esta claro que las contraseñas guardadas en la base de datos no pueden ser revertidas a su forma original, por lo que si la base de datos se ve comprometida, las contraseñas permanencen seguras.
- El orden de los routers importa:
```javascript
const app = express();

app.use(bodyParser.json())
app.use("/api", authRoutes)
app.use("/api", gamesRoutes)
app.use("/api", userRoutes)
app.use(staticRoutes)
```
Esto significa que las rutas de /api seran atentidas por esos routers, pero que cualquier ruta distinta se va a atender por el router statico, ya que dentro posee la siguiente linea

```javascript
app.get("/*", (req, res) => {
    res.sendFile(resolve(__dirname, '..', '..', "frontend", "index.html"))
})
```

por lo que cualquier ruta distinta a las definidas se va a redirigir al index de la pagina.

Si el orden de los routes cambiara, y el router statico se moviera antes, se entenderia que a partir de ese punto todo debe redirigirse al index, por lo que las rutas de la api serian ignoradas. Por ejemplo:
```javascript
const app = express();

app.use(bodyParser.json())
app.use("/api", authRoutes)
app.use("/api", gamesRoutes)
app.use(staticRoutes)
app.use("/api", userRoutes)
```
En este caso las rutas referidas al usuario serian ignoradas (o mejor dicho, redirigidas al index.html)

### Consideraciones del frontend:
- Debido a que no utilizamos un empaquetador de modulos como Webpack, las librerias a utilizar deben ser importadas desde una CDN. Por esta razon puede encontrarse la siguiente linea en el archivo index.html
```html
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js"></script>
```
- El access token se almacena en el local storage (una API del navegador para almacenar cantidades limitades de informacion). Esto resulta inseguro, pero mas sencillo para el ejemplo. La forma mas segura seria utilizar una Cookie [HTTP-only](https://keepcoding.io/blog/que-es-y-como-funciona-httponly-cookies/)
- El metodo de refresh token no ha sido implementado del lado del frontend, y podria realizarse en el request interceptor de Axios (verificando si el token ya expiro antes de proceder con una request).
- En el archivo style.css se puede encontrar un @import. Esto sirve para importar una fuente de Google Fonts, de codigo abierto.

