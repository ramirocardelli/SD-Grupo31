import http from "http";
import { addAnimal, getAllAnimals } from "./controllers/animals.controller.js";
import {
  addCheckpoint,
  getAllCheckpoints,
} from "./controllers/checkpoints.controller.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { loginUser, registerUser } from "./controllers/user.controller.js";
import { connectToBroker } from "./controllers/mqtt.controller.js";

const HTTP_PORT = process.env.PORT;
const secret = process.env.SECRET;

//nos conectamos al broker mqtt
connectToBroker();

//raiz de la api
const server = http.createServer((req, res) => {
  res.writeHead(200, "Operacion exitosa");
  //sea una solicitud get, post etc, siempre se intentara primero, reeconstruir
  //el cuerpo de la solicitud
  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk;
  });

  req.on("end", () => {
    //ruta publica
    if (req.url === "/login") {
      onLogin(req, res, body);
    } else {
      if (tokenIsValid(req)) {
        // Rutas privadas
        // El sistema deberá permitir a los Administradores dar de alta, baja, modificar y mostrar Animales.
        if (req.url === "/animals") {
          onAnimals(req, res, body);
        }
        // El sistema deberá permitir a los Administradores dar de alta, baja, modificar y mostrar Puntos de Control
        else if (req.url === "/checkpoints") {
          onCheckpoints(req, res, body);
        } else {
          res.writeHead(404, "Path invalido");
          res.end();
        }
      } else {
        res.writeHead(401, "Token invalido");
        res.end();
      }
    }
  });
});

//analizamos si el token JWT del usuario es valido, lo podemos ver en el campo
//"authoriation" del header de la solicitud, de la forma:
// ["authorization"]="bearer [tokenJWT]"
function tokenIsValid(req) {
  const token = req.headers["authorization"]?.split(" ")[1];
  try {
    //si es valido, jwt.verify no tira ninguna excepcion
    const verify = jwt.verify(token, secret);
    return true;
  } catch (e) {
    return false;
  }
}

//asumimos que los datos de logeo vienen el el body de la solicitud
//igualmente esto no es correcto, deberia venir en el header.
function onLogin(req, res, data) {
  let parsedBody;
  if (data != "") {
    parsedBody = JSON.parse(data);
  }

  const userClient = parsedBody["name"];
  const passClient = parsedBody["password"];

  if (!parsedBody?.name || !parsedBody?.password) {
    res.writeHead(400, "Credenciales de usuario invalidas");
    res.end();
    return;
  }
  if (req.method === "GET") {
    try {
      //Si el logeo es correcto le devolvemos al usuario su token JWT
      //de lo contrario se lanza una excepcion
      //habria que generar un refresh token si el token inicial sigue en pie
      //o por cada accion refrescar el token, VER
      loginUser(userClient, passClient);
      res.statusCode = 200;
      res.end(JSON.stringify(tokenGenerator(userClient, passClient)));
    } catch (e) {
      res.writeHead(401, e.message);
      res.end();
    }
  }
  if (req.method === "POST") {
    try {
      registerUser(userClient, passClient);
      res.end();
    } catch (e) {
      res.writeHead(401, e.message);
      res.end();
    }
  }
  if (req.method != "GET" || req.method != "POST") {
    res.writeHead(404, "Metodo invalido");
    res.end();
  }
}

//hay que modificar la duracion del token
function tokenGenerator(user, pass) {
  const data = {
    sub: user,
    name: pass,
    //lo que le sumamos es la cantidad de segundos en la que es valido
    exp: Math.floor(Date.now() / 1000) + 30,
  };
  return jwt.sign(data, secret);
}

function onAnimals(req, res, data) {
  if (req.method === "GET") {
    try {
      const resultado = getAllAnimals(req, res);
      res.end(JSON.stringify(resultado));
    } catch (e) {
      res.statusCode = 500;
      res.end();
    }
  }
  if (req.method === "POST") {
    let parsedBody;
    if (data != "") {
      parsedBody = JSON.parse(data);
    }
    if (!parsedBody?.name || !parsedBody?.description) {
      res.writeHead(400, "Credenciales del animal invalidas");
      res.end();
      return;
    }
    try {
      addAnimal(parsedBody.name, parsedBody.description);
      res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      res.end();
    }
  }
  if (req.method != "GET" || req.method != "POST") {
    res.writeHead(404, "Metodo invalido");
    res.end();
  }
}

function onCheckpoints(req, res, data) {
  if (req.method === "GET") {
    try {
      const resultado = getAllCheckpoints(req, res);
      res.end(JSON.stringify(resultado));
    } catch (e) {
      res.statusCode = 500;
      res.end();
    }
  }
  if (req.method === "POST") {
    let parsedBody;
    if (data != "") {
      parsedBody = JSON.parse(data);
    }
    if (!parsedBody?.name || !parsedBody?.description) {
      res.writeHead(400, "credenciales de checkpoint invalida/s");
      res.end();
      return;
    }
    try {
      addCheckpoint(parsedBody.name, parsedBody.description);
      res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      res.end();
    }
  }
  if (req.method != "GET" || req.method != "POST") {
    res.writeHead(404, "Metodo invalido");
    res.end();
  }
}

//levantamos el server
server.listen(HTTP_PORT, () => {
  console.log(`Servidor escuchando en puerto ${HTTP_PORT}`);
});
