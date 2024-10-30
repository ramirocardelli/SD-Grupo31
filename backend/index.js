import http from "http";
import {
  addAnimal,
  getAllAnimals,
  getAnimal,
  modAnimal,
  removeAnimal,
} from "./controllers/animals.controller.js";
import {
  addCheckpoint,
  getAllCheckpoints,
  getCheckpoint,
  removeCheckpoint,
  modCheckpoint,
} from "./controllers/checkpoints.controller.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { login } from "./controllers/user.controller.js";
import {
  connectToBroker,
  getPosiciones,
} from "./controllers/mqtt.controller.js";
import express from "express";
import cors from "cors";
import path from "path";

const HTTP_PORT = process.env.PORT;
const secret = process.env.SECRET;

// Conexión con el broker MQTT
connectToBroker();

// usamos express y cors para poder comunicar back/front
const app = express();
app.use(cors());

// Raíz de la API
const server = http.createServer((req, res) => {
  // Sea el tipo de solicitud que sea, siempre se intentara primero, reeconstruir el cuerpo de la solicitud
  let body = "";

  // Separamos el path para poder obtener la direccion principal y el recurso
  const pathArray = req.url.split("/");
  pathArray.shift();

  req.on("data", (chunk) => {
    body = body + chunk;
  });

  req.on("end", () => {
    console.log("[DEBUG]: " + JSON.stringify({ path: req.path, url: req.url, metodo: req.method, body: body }))
    const parsedBody = body != "" ? JSON.parse(body) : null;

    // Rutas públicas
    if (pathArray[0] === "login") {
      onLogin(req, res, parsedBody, pathArray);
      return;
    }

    if (pathArray[0] === "refresh") {
      onRefresh(req, res, parsedBody, pathArray);
      return;
    }

    // Para las rutas privadas, si el tóken no es válido, no sigue
    try {
      tokenIsValid(req);
    } catch (e) {
      res.writeHead(401, e.message);
      return res.end();
    }

    // Rutas privadas

    // El sistema deberá permitir a los Administradores dar de alta, baja, modificar y mostrar Animales.
    if (pathArray[0] === "animals") {
      onAnimals(req, res, parsedBody, pathArray);
      return;
    }

    // El sistema deberá permitir a los Administradores dar de alta, baja, modificar y mostrar Puntos de Control
    if (pathArray[0] === "checkpoints") {
      onCheckpoints(req, res, parsedBody, pathArray);
      return;
    }

    res.writeHead(404, "Path invalido");
    return res.end();
  });
});

/*
Analizamos si el token JWT del usuario es valido, lo podemos ver en el campo
"authorization" del header de la solicitud, de la forma:
["authorization"]="bearer [tokenJWT]"
*/

function tokenIsValid(req) {
  const token = req.headers["authorization"]?.split(" ")[1];
  // Si es válido, jwt.verify no lanza ninguna excepción
  jwt.verify(token, secret);
  return;
}

// Asumimos que los datos de logeo vienen el el body de la solicitud
// Igualmente esto no es correcto, deberia venir en el header.
function onLogin(req, res, body, pathArray) {

  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: 'No se proporcionó encabezado de autorización' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, "base64")
    .toString("ascii")
    .split(":");

  const username = credentials[0];
  const password = credentials[1];

  // verificar que login no venga con id
  if (pathArray[1] === "id") {
    res.writeHead(404, "Método invalido");
    return res.end();
  }

  if (!username || !password) {
    res.writeHead(400, "Credenciales de usuario invalidas");
    return res.end();
  }

  if (req.method === "POST") {
    try {
      // Si el logeo es correcto le devolvemos al usuario su token JWT
      // De lo contrario se lanza una excepcion
      // O por cada accion refrescar el token
      login(username, password);

      const tokens = {
        accessToken: accessToken(username),
        refreshToken: refreshToken(username),
      };

      res.writeHead(200);
      return res.end(JSON.stringify(tokens));
    } catch (e) {
      res.writeHead(401, e.message);
      return res.end();
    }
  }

  // No hay registro, lo comento por si llegamos a agregarlo
  /*
  if (req.method === "POST") {
    try {
      register(username, password);
      res.writeHead(200);
      return res.end();
    } catch (e) {
      res.writeHead(401, e.message);
      return res.end();
    }
  }
  */

  res.writeHead(404, "Método invalido");
  return res.end();
}

function accessToken(username) {
  return tokenGenerator(username, 60);
}

function refreshToken(username) {
  return tokenGenerator(username, 3600);
}

function tokenGenerator(username, seconds) {
  const data = {
    username: username,
    //lo que le sumamos es la cantidad de segundos en la que es valido
    exp: Math.floor(Date.now() / 1000) + seconds,
  };
  return jwt.sign(data, secret);
}

function onRefresh(req, res, body, pathArray) {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];

  // verificar que refresh no venga con id
  if (pathArray[1] === "id") {
    res.writeHead(404, "Método invalido");
    return res.end();
  }

  if (!refreshToken) {
    res.writeHead(400, "Token invalid");
    return res.end();
  }

  try {
    const decoded = jwt.verify(refreshToken, secret);
    const newAccessToken = accessToken(decoded?.username);

    const tokens = {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    };

    res.writeHead(200);
    return res.end(JSON.stringify(tokens));
  } catch (e) {
    res.writeHead(401, e.message);
    return res.end();
  }
}

function onAnimals(req, res, body, pathArray) {
  // Solo delete, patch y get vienen con id

  // Si el get viene sin id, devolvemos todos los animales
  if (!pathArray[1]) {
    if (req.method === "GET") {
      const animals = getAllAnimals();
      res.writeHead(200);
      return res.end(JSON.stringify(animals));
    }
  }

  // Si el get viene con el id, devolvemos solo ese animal

  // Para obtener la posición de todos los animales
  if (pathArray[1] === "position") {
    if (req.method === "GET") {
      res.writeHead(200);
      return res.end(JSON.stringify(getPosiciones()));
    }
    // Solo get viene con /position, los demas son metodos invalidos
    res.writeHead(404, "Metodo invalido");
    return res.end();
  }

  if (req.method === "GET") {
    const id = pathArray[1];

    const animal = getAnimal(id);

    if (!animal) {
      res.writeHead(400, "Animal inexistente");
      return res.end();
    }

    res.writeHead(200);
    return res.end(JSON.stringify(animal));
  }

  // Si el delete viene con el id, eliminamos el animal
  if (req.method === "DELETE") {
    const id = pathArray[1];
    if (!id) {
      res.writeHead(400, "Id del animal que se quiere eliminar invalido");
      return res.end();
    }

    try {
      removeAnimal(id);
      res.writeHead(200, "Se eliminó el animal con éxito");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  // Si el patch viene con el id, modificamos el animal
  if (req.method === "PATCH") {
    const id = pathArray[1];
    const animal = getAnimal(id);
    const name = body?.name || animal?.name;
    const description = body?.description || animal?.description;

    if (!id || !name || !description) {
      res.writeHead(404, "Animal not found");
      return res.end();
    }

    try {
      modAnimal(id, name, description);
      res.writeHead(200, "El animal se modificó correctamente");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  if (req.method === "POST" && !pathArray[1]) {
    const id = body?.id;
    const name = body?.name || "Animal sin nombre";
    const description = body?.description || "Animal sin descripción";

    if (!id) {
      res.writeHead(400, "Credenciales del animal insuficientes");
      return res.end();
    }

    try {
      addAnimal(id, name, description);
      res.writeHead(200, "Animal añadido con éxito");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  res.writeHead(404, "Metodo invalido");
  return res.end();
}

function onCheckpoints(req, res, body, pathArray) {
  // Solo delete, patch y get vienen con id

  // Si el get viene sin id, devolvemos todos los checkpoints
  if (!pathArray[1]) {
    if (req.method === "GET") {
      const checkpoints = getAllCheckpoints();
      res.writeHead(200);
      return res.end(JSON.stringify(checkpoints));
    }
  }

  if (req.method === "GET") {
    const id = pathArray[1];

    const checkpoint = getCheckpoint(id);

    if (!checkpoint) {
      res.writeHead(400, "Checkpoint inexistente");
      return res.end();
    }

    res.writeHead(200);
    return res.end(JSON.stringify(checkpoint));
  }

  // Si el delete viene con el id, eliminamos el checkpoint
  if (req.method === "DELETE") {
    const id = pathArray[1];
    if (!id) {
      res.writeHead(400, "Id del checkpoint que se quiere eliminar invalido");
      return res.end();
    }

    try {
      removeCheckpoint(id);
      res.writeHead(200, "Se eliminó el checkpoint con éxito");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  // Si el patch viene con el id, modificamos el checkpoint
  if (req.method === "PATCH") {
    const id = pathArray[1];
    const checkpoint = getCheckpoint(id);
    const lat = body?.lat || checkpoint?.lat;
    const long = body?.long || checkpoint?.long;
    const description = body?.description || checkpoint?.description;

    if (!id || !lat || !long || !description) {
      res.writeHead(404, "Checkpoint not found");
      return res.end();
    }

    try {
      modCheckpoint(id, lat, long, description);
      res.writeHead(200, "El checkpoint se modificó correctamente");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  if (req.method === "POST" && !pathArray[1]) {
    const id = body?.id;
    const lat = body?.lat;
    const long = body?.long;
    const description = body?.description || "Checkpoint sin descripción";

    if (!id || !description || !lat || !long) {
      res.writeHead(400, "Credenciales del checkpoint insuficientes");
      return res.end();
    }

    try {
      addCheckpoint(id, lat, long, description);
      res.writeHead(200, "Checkpoint añadido con éxito");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  res.writeHead(404, "Metodo invalido");
  return res.end();
}

// Levantamos el server
server.listen(HTTP_PORT, () => {
  console.log(`Servidor escuchando en puerto ${HTTP_PORT}`);
});
