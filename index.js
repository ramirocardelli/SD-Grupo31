import http from "http";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { addAnimal, getAllAnimals } from "./controllers/animals.controller.js";
import {
  addCheckpoint,
  getAllCheckpoints,
} from "./controllers/checkpoints.controller.js";
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
      onLogin(req.method, res, body);
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

function tokenIsValid(req) {
  const token = req.headers["authorization"].split(" ")[1];
  try {
    const verify = jwt.verify(token, secret);
    return true;
  } catch (e) {
    return false;
  }
}

function onLogin(metodo, res, data) {
  const parsedBody = JSON.parse(data);
  const userClient = parsedBody["name"];
  const passClient = parsedBody["password"];
  if (metodo === "GET") {
    try {
      loginUser(userClient, passClient);
      res.statusCode = 200;
      res.end(JSON.stringify(tokenGenerator(userClient, passClient)));
    } catch (e) {
      res.writeHead(401, e.message);
      res.end();
    }
  }
  if (metodo === "POST") {
    try {
      registerUser(userClient, passClient);
      res.end();
    } catch (e) {
      res.writeHead(401, e.message);
      res.end();
    }
  }
}

//hay que modificar la duracion del token
function tokenGenerator(user, pass) {
  const data = {
    sub: user,
    name: pass,
    exp: Math.floor(Date.now() / 1000) + 36000,
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
    const parsedBody = JSON.parse(data);
    if (!parsedBody.name || !parsedBody.description) {
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
    const parsedBody = JSON.parse(data);
    if (!parsedBody.name || !parsedBody.description) {
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
}

//levantamos el server
server.listen(HTTP_PORT, () => {
  console.log(`Servidor escuchando en puerto ${HTTP_PORT}`);
});
