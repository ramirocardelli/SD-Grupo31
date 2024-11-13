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
  getPositions,
  getAvailableAnimals,
  deleteAvailableDevice,
} from "./controllers/mqtt.controller.js";

const HTTP_PORT = process.env.PORT;
const secret = process.env.SECRET;

// Conexión con el broker MQTT
connectToBroker();

// Este método se encarga de configurar los encabezados CORS para todas las respuestas
// Sin este método, el navegador bloqueará las solicitudes de la API
const setCorsHeaders = (res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
};

// Creamos el servidor HTTP
const server = http.createServer((req, res) => {
  // Si la solicitud es un OPTIONS, respondemos con los encabezados CORS y un 204 (No content)
  if (req.method === "OPTIONS") {
    setCorsHeaders(res);
    res.writeHead(204);
    return res.end();
  }

  // Sea el tipo de solicitud que sea, siempre se intentara primero, reeconstruir el cuerpo de la solicitud
  let body = "";

  // Separamos el path para poder obtener la direccion principal y el recurso
  const pathArray = req.url.split("/");
  pathArray.shift(); // Eliminamos el primer elemento que es una cadena vacía

  // Si el path comienza con "API", lo eliminamos
  if (pathArray[0] == "API") {
    pathArray.shift();
  } else {
    res.writeHead(400, "Path incorrecto");
    return res.end();
  }

  req.on("data", (chunk) => {
    body = body + chunk;
  });

  req.on("end", () => {
    setCorsHeaders(res); // Configura los encabezados CORS para todas las respuestas
    res.setHeader("Content-Type", "application/json");
    console.log(
      "[DEBUG]: " +
        JSON.stringify({
          path: req.path,
          url: req.url,
          method: req.method,
          body: body,
        })
    );
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

    // Para las rutas privadas, si el tóken no es válido, no sigue con la ejecución
    try {
      tokenIsValid(req);
    } catch (e) {
      res.writeHead(401, e.message);
      return res.end();
    }

    // Rutas privadas

    if (pathArray[0] === "availableDevices") {
      onAvailableDevices(req, res, pathArray);
      return;
    }

    // Todo lo relacionado a los animales
    if (pathArray[0] === "animals") {
      onAnimals(req, res, parsedBody, pathArray);
      return;
    }

    // Todo lo relacionado a los puntos de control
    if (pathArray[0] === "checkpoints") {
      onCheckpoints(req, res, parsedBody, pathArray);
      return;
    }

    // Si no se encuentra la ruta, devolvemos un error 404
    res.writeHead(404, "Ruta no encontrada");
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

// Credenciales vienen en el header en formato 64.
function onLogin(req, res, body, pathArray) {
  // Si el método no es post, devolvemos un error 405
  if (req.method !== "POST") {
    res.writeHead(405, "Metodo invalido");
    return res.end();
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401, "No se proporcionó encabezado de autorización");
  }

  // Verificar que la ruta sea /API/login
  if (pathArray.length > 1) {
    res.status(401, "Path equivocado");
    return res.end();
  }

  // Extraemos las credenciales del header de autorización
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64")
    .toString("ascii")
    .split(":");

  const username = credentials[0];
  const password = credentials[1];

  if (!username || !password) {
    res.writeHead(400, "Credenciales de usuario invalidas");
    return res.end();
  }

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

function accessToken(username) {
  return tokenGenerator(username, 3600); // 1h
}

function refreshToken(username) {
  return tokenGenerator(username, 86400); // 24h
}

function tokenGenerator(username, seconds) {
  // Creamos un token JWT con el nombre de usuario y una expiración de "seconds" segundos
  const data = {
    username,
    exp: Math.floor(Date.now() / 1000) + seconds,
  };
  return jwt.sign(data, secret);
}

function onRefresh(req, res, body, pathArray) {
  // Solo post viene con refresh
  if (req.method !== "POST") {
    res.writeHead(405, "Metodo invalido");
    return res.end();
  }

  const refreshToken = req.headers["authorization"]?.split(" ")[1];

  // Verificar que la ruta sea /API/refresh
  if (pathArray.length > 1) {
    res.writeHead(404, "Path invalido");
    return res.end();
  }

  // Si no se proporciona un refreshToken, devolvemos un error 400
  if (!refreshToken) {
    res.writeHead(400, "Token invalid");
    return res.end();
  }

  try {
    // Si el refreshToken es válido, generamos un nuevo token de acceso
    // En caso contrario, devolvemos un error 401
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

function onAvailableDevices(req, res, pathArray) {
  // Solo get viene con availableDevices
  if (req.method !== "GET") {
    res.writeHead(405, "Metodo invalido");
    return res.end();
  }

  // Verificar que la ruta sea /API/availableDevices
  if (pathArray.length > 1) {
    res.writeHead(404, "Path invalido");
    return res.end();
  }

  try {
    res.writeHead(200);
    return res.end(JSON.stringify(getAvailableAnimals()));
  } catch (e) {
    res.writeHead(401, e.message);
    return res.end();
  }
}

function onAnimals(req, res, body, pathArray) {
  // Si la ruta es /API/animals, sin id
  if (!pathArray[1]) {
    // Si el get viene sin id, devolvemos todos los animales
    if (req.method === "GET") {
      const animals = getAllAnimals();
      res.writeHead(200);
      return res.end(JSON.stringify(animals));
    }

    // Añadimos un nuevo animal
    if (req.method === "POST") {
      const id = body?.id;
      const name = body?.name || "Animal sin nombre";
      const description = body?.description || "Animal sin descripción";

      if (!id) {
        res.writeHead(400, "Credenciales del animal insuficientes");
        return res.end();
      }

      try {
        // Añadimos el animal y eliminamos el dispositivo de la lista de disponibles
        addAnimal(id, name, description);
        deleteAvailableDevice(id);
        res.writeHead(200, "Animal añadido con éxito");
        return res.end();
      } catch (e) {
        res.writeHead(400, e.message);
        return res.end();
      }
    }

    res.writeHead(405, "Metodo invalido");
    return res.end();
  }

  // Si la ruta es /API/animals/position
  if (pathArray[1] === "position") {
    // Devolvemos todos los animales con sus posiciones correspondientes
    if (req.method === "GET") {
      res.writeHead(200);
      return res.end(JSON.stringify(getPositions()));
    }

    res.writeHead(405, "Metodo invalido");
    return res.end();
  }

  // Si la ruta es /API/animals/[id]
  if (req.method === "GET") {
    // Devolvemos el animal con el id correspondiente
    const id = pathArray[1];
    const animal = getAnimal(id);

    if (!animal) {
      res.writeHead(400, "Animal inexistente");
      return res.end();
    }

    res.writeHead(200);
    return res.end(JSON.stringify(animal));
  }

  // Si la ruta es /API/animals/[id]
  if (req.method === "DELETE") {
    // Eliminamos el animal con el id correspondiente
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

  // Si la ruta es /API/animals/[id]
  if (req.method === "PATCH") {
    // Modificamos el animal con el id correspondiente
    const id = pathArray[1];
    const animal = getAnimal(id);
    const name = body?.name || animal?.name;
    const description = body?.description || animal?.description;

    if (!id) {
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

  res.writeHead(404, "Metodo invalido");
  return res.end();
}

// Server Sent Events
function notifyNewCheckpoint(checkpoint) {
  sseConnections.forEach((connection) => {
    connection.sendSSE(checkpoint);
  });
}

function onCheckpoints(req, res, body, pathArray) {
  // Si la ruta es /API/checkpoints, sin id
  if (!pathArray[1]) {
    // Si el get viene sin id, devolvemos todos los checkpoints
    if (req.method === "GET") {
      const checkpoints = getAllCheckpoints();
      res.writeHead(200);
      return res.end(JSON.stringify(checkpoints));
    }

    // Añadimos un nuevo checkpoint
    if (req.method === "POST") {
      const id = body?.id;
      const lat = body?.lat;
      const long = body?.long;
      const description = body?.description || "Checkpoint sin descripción";

      if (!id || !lat || !long) {
        res.writeHead(400, "Credenciales del checkpoint insuficientes");
        return res.end();
      }

      try {
        // Añadimos el checkpoint
        addCheckpoint(id, lat, long, description);
        // notifyNewCheckpoint(id, lat, long);
        res.writeHead(200, "Checkpoint añadido con éxito");
        return res.end();
      } catch (e) {
        res.writeHead(400, e.message);
        return res.end();
      }
    }

    res.writeHead(405, "Metodo invalido");
    return res.end();
  }

  // Si la ruta es /API/checkpoints/[id]
  if (req.method === "GET") {
    // Devolvemos el checkpoint con el id correspondiente
    const id = pathArray[1];
    const checkpoint = getCheckpoint(id);

    if (!checkpoint) {
      res.writeHead(400, "Checkpoint inexistente");
      return res.end();
    }

    res.writeHead(200);
    return res.end(JSON.stringify(checkpoint));
  }

  // Si la ruta es /API/checkpoints/[id]
  if (req.method === "DELETE") {
    // Eliminamos el checkpoint con el id correspondiente
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

  // Si la ruta es /API/checkpoints/[id]
  if (req.method === "PATCH") {
    // Modificamos el checkpoint con el id correspondiente
    const id = pathArray[1];
    const checkpoint = getCheckpoint(id);
    const lat = body?.lat || checkpoint?.lat;
    const long = body?.long || checkpoint?.long;
    const description = body?.description || checkpoint?.description;

    if (!id) {
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

  res.writeHead(404, "Metodo invalido");
  return res.end();
}

// Inicializamos el servidor en el puerto HTTP_PORT
server.listen(HTTP_PORT, () => {
  console.log(`API vanilla corriendo en ${HTTP_PORT}`);
});
