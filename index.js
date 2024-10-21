import http from "http";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { getAllAnimals } from "./controllers/animals.controller.js";
import { getAllCheckpoints } from "./controllers/checkpoints.controller.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
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
  //ruta publica
  if (req.url === "/login") {
    onLogin(req, res);
  }

  // Rutas privadas
  try {
    // Validación del token TODO
    // const token = req.headers.authorization;
    // const payload = jwt.verify(token, secret);

    req.on("end", () => {
      // El sistema deberá permitir a los Administradores dar de alta, baja, modificar y mostrar Animales.
      if (req.url === "/animals") {
        if (req.method === "GET") {
          getAllAnimals(req, res);
          res.end();
        }
        if (req.method === "POST") {
          const parsedBody = JSON.parse(body);
          if (!parsedBody.name || !parsedBody.description) {
            res.writeHead(
              400,
              "Invalid request, missing animal name or description"
            );
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
      // El sistema deberá permitir a los Administradores dar de alta, baja, modificar y mostrar Puntos de Control
      else if (req.url === "/checkpoints") {
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
            res.writeHead(
              400,
              "Invalid request, checkpoint name already exists."
            );
            res.end();
            return;
          }
          existingCheckpoints.push(newCheckpoint);

          writeCheckpoints(existingCheckpoints);
          res.end();
          return;
        }
      }
    });
  } catch (e) {
    res.writeHead(401, { error: e?.message });
    res.end();
  }
});

function onLogin(req, res) {
  //si quiere logear aca consideramos q manda los datos x body, pero se puede hacer en
  //el head de la request, lo hice como tantear como va, despues vemos bien eso son 2 seg
  // el flujo es el siguiente, ya que viene los datos de usuario en el body, primero lo parseamos
  //y luego nos fijamos que hacer si GET o POST, si es GET, nos fijamos si el usuario existe,
  // y si la contra es correcta, si se confirma, le mandamos su JWT.
  //si es POST, solamente nos fijamos que el usuario no exista y lo registramos
  let body = "";
  req.on("data", (chunk) => {
    body = body + chunk;
  });
  req.on("end", () => {
    const parsedBody = JSON.parse(body);
    const userClient = parsedBody["user"];
    const passClient = parsedBody["pass"];
    if (req.method === "GET") {
      try {
        let usuarios = fs.readFileSync(process.env.USERPATH);
        usuarios = JSON.parse(usuarios);
        usuarios.forEach((user) => {
          if (user.user == userClient) {
            if (user.pass == passClient) {
              res.statusCode = 400;
              res.end(JSON.stringify(tokenGenerator(userClient, passClient)));
            } else {
              res.writeHead(401, "Contraseña incorrecta");
              res.statusCode = 401;
              res.end();
            }
          }
        });
        res.writeHead(401, "Usuario inexistente");
        res.statusCode = 401;
        res.end();
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.writeHead(500, "internal server error");
        res.end();
      }
    }
    if (req.method === "POST") {
      try {
        let usuarios = fs.readFileSync(process.env.USERPATH);
        usuarios = JSON.parse(usuarios);
        usuarios.forEach((user) => {
          if (user.user == userClient) {
            res.statusCode = 400;
            res.writeHead(400, "usuario existente");
            res.end();
          }
        });
        res.writeHead(200, "Usuario registrado");
        res.statusCode = 200;
        const objetoJson = {
          user: userClient,
          pass: passClient,
        };
        usuarios.push(objetoJson);
        fs.writeFileSync(process.env.USERPATH, JSON.stringify(usuarios));
        res.end();
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.writeHead(500, "internal server error");
        res.end();
      }
    }
  });
}

function tokenGenerator(user, pass) {
  const data = {
    sub: user,
    name: pass,
    exp: Math.floor(Date.now() / 1000) + 60,
  };
  return jwt.sign(data, secret);
}
//levantamos el server
server.listen(HTTP_PORT, () => {
  console.log(`Servidor escuchando en puerto ${HTTP_PORT}`);
});
