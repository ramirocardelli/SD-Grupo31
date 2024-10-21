import http from "http";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { getAllAnimals } from "./controllers/animals.controller.js";
import { getAllCheckpoints } from "./controllers/checkpoints.controller.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { loginUser, registerUser } from "./controllers/user.controller.js";
import {
  getAnimals,
  writeAnimals,
} from "./repositories/animals.repositories.js";
import {
  getCheckpoints,
  writeCheckpoints,
} from "./repositories/checkpoints.repositories.js";
import { parse } from "path";

const HTTP_PORT = process.env.PORT;
const secret = process.env.SECRET;

//documentar
const hasSameName = (array, newObject) => {
  for (const obj of array) {
    if (obj.name === newObject.name) {
      return true;
    }
  }
  return false;
};

//raiz de la api
const server = http.createServer((req, res) => {
  res.statusCode = 200;

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
          onCheckpoints(req, res);
        } else {
          res.writeHead(404, "Path invalido");
          res.statusCode = 404;
          res.end();
        }
      } else {
        res.writeHead(401, "Token invalido");
        res.statusCode = 401;
        res.end();
      }
    }
  });
});

function tokenIsValid(req) {
  const token = req.headers["authorization"].split(" ")[1];
  try {
    const verify = jwt.verify(token, secret);
    return true;
  } catch (e) {
    return false;
  }
}

function onLogin(req, res, data) {
  const parsedBody = JSON.parse(data);
  const userClient = parsedBody["user"];
  const passClient = parsedBody["pass"];
  if (req.method === "GET") {
    if (loginUser(req, res, userClient, passClient)) {
      res.statusCode = 200;
      res.end(JSON.stringify(tokenGenerator(userClient, passClient)));
    }
  }
  if (req.method === "POST") {
    registerUser(req, res, userClient, passClient);
  }
}

//hay que modificar la duracion del token
function tokenGenerator(user, pass) {
  const data = {
    sub: user,
    name: pass,
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  return jwt.sign(data, secret);
}

function onAnimals(req, res, data) {
  if (req.method === "GET") {
    getAllAnimals(req, res);
    res.end();
  }
  if (req.method === "POST") {
    const parsedBody = JSON.parse(data);
    if (!parsedBody.name || !parsedBody.description) {
      res.writeHead(400, "Invalid request, missing animal name or description");
      res.end();
      return;
    }
    const newAnimal = {
      uid: uuidv4(),
      name: parsedBody.name,
      description: parsedBody.description,
    };
    const existingAnimals = getAnimals();
    if (hasSameName(existingAnimals, newAnimal)) {
      res.writeHead(400, "Invalid request, animal name already exists.");
      res.end();
      return;
    }
    existingAnimals.push(newAnimal);

    writeAnimals(existingAnimals);
    res.end();
    return;
  }
}

function onCheckpoints(req, res) {
  if (req.method === "GET") {
    getAllCheckpoints(req, res);
    res.end();
  }
  if (req.method === "POST") {
    const parsedBody = JSON.parse(body);
    if (!parsedBody.name || !parsedBody.description) {
      res.writeHead(
        400,
        "Invalid request, missing checkpoint name or description"
      );
      res.end();
      return;
    }
    const newCheckpoint = {
      uid: uuidv4(),
      name: parsedBody.name,
      description: parsedBody.description,
    };
    const existingCheckpoints = getCheckpoints();
    if (hasSameName(existingCheckpoints, newCheckpoint)) {
      res.writeHead(400, "Invalid request, checkpoint name already exists.");
      res.end();
      return;
    }
    existingCheckpoints.push(newCheckpoint);

    writeCheckpoints(existingCheckpoints);
    res.end();
    return;
  }
}

//levantamos el server
server.listen(HTTP_PORT, () => {
  console.log(`Servidor escuchando en puerto ${HTTP_PORT}`);
});
