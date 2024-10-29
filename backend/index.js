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
import { connectToBroker } from "./controllers/mqtt.controller.js";
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
  const base64Credentials = req.headers.authorization.split(" ")[1] || "";
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

  // GET puede no venir con id, para obtener todos los animales
  if (!pathArray[1]) {
    if (req.method === "GET") {
      const animals = getAllAnimals(req, res);
      res.writeHead(200);
      return res.end(JSON.stringify(animals));
    }
  } else {
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

    if (req.method === "PATCH") {
      const match = req.url.match(/^\/animals\/([a-z0-9\-]+)$/);

      if (!match) {
        res.writeHead(400, "Id del animal invalido");
        return res.end();
      }

      const id = match[1];
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

    // si get viene con un id muestro solo la posicion de un animal
    if (req.method === "GET") {
      const match = req.url.match(/^\/animals\/([a-z0-9\-]+)$/);

      if (!match) {
        res.writeHead(400, "Id del animal invalido");
        return res.end();
      }

      const id = match[1];

      const animal = getAnimal(id);

      if (!animal) {
        res.writeHead(400, "Animal inexistente");
        return res.end();
      }

      res.writeHead(200);
      return res.end(JSON.stringify(animal));
    }

    // POST no tiene que venir con id
    res.writeHead(404, "Metodo invalido");
    return res.end();
  }

  if (pathArray[1] === "position") {
    if (req.method === "GET") {
      const animals = getAllAnimals(req, res);
      res.writeHead(200);
      return res.end(JSON.stringify(animals));
    } else {
      //solo get viene con /position, los demas son metodos invalidos
      res.writeHead(404, "Metodo invalido");
      return res.end();
    }
  }

  // POST nunca viene con id
  if (req.method === "POST" && !pathArray[1]) {
    const id = body?.id;
    const name = body?.name;
    const description = body?.description;

    if (!id || !name || !description) {
      res.writeHead(400, "Credenciales del animal invalidas");
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
  if (pathArray[1] === "id") {
    // PATCH/DELETE DEBEN venir con id - GET puede venir con id (muestro solo 1)
    if (req.method === "PATCH") {
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

    if (req.method === "GET") {
      const name = body?.name;

      if (!name) {
        res.writeHead(400, "Nombre del checkpoint invalido");
        return res.end();
      }

      const checkpoint = getCheckpoint(name);

      if (!checkpoint) {
        res.writeHead(400, "Checkpoint inexistente");
        return res.end();
      }

      res.writeHead(200);
      return res.end(JSON.stringify(checkpoint));
    }
  }

  if (req.method === "GET") {
    const checkpoints = getAllCheckpoints(req, res);
    res.writeHead(200);
    return res.end(JSON.stringify(checkpoints));
  }

  if (req.method === "POST" && !pathArray[1]) {
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

  res.writeHead(404, "Metodo invalido");
  return res.end();
}

// Levantamos el server
server.listen(HTTP_PORT, () => {
  console.log(`Servidor escuchando en puerto ${HTTP_PORT}`);
});
