import http from "http";
import {
  addAnimal,
  getAllAnimals,
  modAnimal,
  removeAnimal,
} from "./controllers/animals.controller.js";
import {
  addCheckpoint,
  getAllCheckpoints,
  removeCheckpoint,
  modCheckpoint,
} from "./controllers/checkpoints.controller.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { login } from "./controllers/user.controller.js";
import { connectToBroker } from "./controllers/mqtt.controller.js";
import express from "express";
import cors from "cors";

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
  req.on("data", (chunk) => {
    body = body + chunk;
  });

  req.on("end", () => {
    const parsedBody = body != "" ? JSON.parse(body) : null;

    // Rutas públicas
    if (req.url === "/login") {
      onLogin(req, res, parsedBody);
      return;
    }

    if (req.url === "/refresh") {
      onRefresh(req, res, parsedBody);
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
    if (req.url === "/animals") {
      onAnimals(req, res, parsedBody);
      return;
    }

    // El sistema deberá permitir a los Administradores dar de alta, baja, modificar y mostrar Puntos de Control
    if (req.url === "/checkpoints") {
      onCheckpoints(req, res, parsedBody);
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
function onLogin(req, res, body) {
  const base64Credentials = req.headers.authorization.split(" ")[1] || "";
  const credentials = Buffer.from(base64Credentials, "base64")
    .toString("ascii")
    .split(":");

  const username = credentials[0];
  const password = credentials[1];

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

function onRefresh(req, res, body) {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];

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

function onAnimals(req, res, body) {
  if (req.method === "GET") {
    const animals = getAllAnimals(req, res);
    res.writeHead(200);
    return res.end(JSON.stringify(animals));
  }

  if (req.method === "POST") {
    const name = body?.name;
    const description = body?.description;

    if (!name || !description) {
      res.writeHead(400, "Credenciales del animal invalidas");
      return res.end();
    }

    try {
      addAnimal(name, description);
      res.writeHead(200, "Animal añadido con éxito");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  if (req.method === "PUT") {
    const name = body?.name;
    const description = body?.description;

    if (!name || !description) {
      res.writeHead(400, "Credenciales del animal invalidas");
      return res.end();
    }

    try {
      modAnimal(name, description);
      res.writeHead(200, "El animal se modificó correctamente");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  if (req.method === "DELETE") {
    const name = body?.name;
    if (!name) {
      res.writeHead(400, "Credenciales del animal invalidas");
      return res.end();
    }

    try {
      removeAnimal(name);
      res.writeHead(200, "Se eliminó el animal con éxito");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  res.writeHead(404, "Metodo invalido");
  return res.end();
}

function onCheckpoints(req, res, body) {
  if (req.method === "GET") {
    const checkpoints = getAllCheckpoints(req, res);
    res.writeHead(200);
    return res.end(JSON.stringify(checkpoints));
  }

  if (req.method === "POST") {
    const name = body?.name;
    const description = body?.description;

    if (!name || !description) {
      res.writeHead(400, "Credenciales de checkpoint inválidas");
      return res.end();
    }

    try {
      addCheckpoint(name, description);
      res.writeHead(200, "se creo el checkpoint");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  if (req.method === "PUT") {
    const name = body?.name;
    const description = body?.description;

    if (!name || !description) {
      res.writeHead(400, "Credenciales de checkpoint inválidas");
      return res.end();
    }

    try {
      modCheckpoint(name, description);
      res.writeHead(200, "Se modificó el checkpoint correctamente");
      return res.end();
    } catch (e) {
      res.writeHead(400, e.message);
      return res.end();
    }
  }

  if (req.method === "DELETE") {
    const name = body?.name;

    if (!name) {
      res.writeHead(400, "credenciales de checkpoint invalida/s");
      return res.end();
    }

    try {
      removeCheckpoint(name);
      res.writeHead(200, "checkpoint eliminado");
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
