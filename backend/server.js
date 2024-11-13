import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
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
import { login } from "./controllers/user.controller.js";
import {
  connectToBroker,
  getPositions,
  getAvailableAnimals,
  deleteAvailableDevice,
} from "./controllers/mqtt.controller.js";

const app = express();
const HTTP_PORT = process.env.PORT_EXP;
const secret = process.env.SECRET;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// Connect to MQTT broker
connectToBroker();

// Middleware to validate JWT token
const tokenIsValid = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  try {
    jwt.verify(token, secret);
    next();
  } catch (e) {
    res.status(401).send(e.message);
  }
};

// Public routes
app.post("/API/login", (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("No se proporcionó encabezado de autorización");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64")
    .toString("ascii")
    .split(":");
  const username = credentials[0];
  const password = credentials[1];

  if (!username || !password) {
    return res.status(400).send("Credenciales de usuario invalidas");
  }

  try {
    login(username, password);
    const tokens = {
      accessToken: accessToken(username),
      refreshToken: refreshToken(username),
    };
    res.status(200).json(tokens);
  } catch (e) {
    res.status(401).send(e.message);
  }
});

app.post("/API/refresh", (req, res) => {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];
  if (!refreshToken) {
    return res.status(400).send("Token invalid");
  }

  try {
    const decoded = jwt.verify(refreshToken, secret);
    const newAccessToken = accessToken(decoded?.username);
    const tokens = {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    };
    res.status(200).json(tokens);
  } catch (e) {
    res.status(401).send(e.message);
  }
});

app.get("/API/availableDevices", tokenIsValid, (req, res) => {
  try {
    res.status(200).json(getAvailableAnimals());
  } catch (e) {
    res.status(401).send(e.message);
  }
});

// Animal routes
app
  .route("/API/animals")
  .get(tokenIsValid, (req, res) => {
    res.status(200).json(getAllAnimals());
  })
  .post(tokenIsValid, (req, res) => {
    const {
      id,
      name = "Animal sin nombre",
      description = "Animal sin descripción",
    } = req.body;
    if (!id) {
      return res.status(400).send("Credenciales del animal insuficientes");
    }

    try {
      addAnimal(id, name, description);
      deleteAvailableDevice(id);
      res.status(200).send("Animal añadido con éxito");
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

app.route("/API/animals/position").get(tokenIsValid, (req, res) => {
  res.status(200).json(getPositions());
});

app
  .route("/API/animals/:id")
  .get(tokenIsValid, (req, res) => {
    const animal = getAnimal(req.params.id);
    if (!animal) {
      return res.status(400).send("Animal inexistente");
    }
    res.status(200).json(animal);
  })
  .delete(tokenIsValid, (req, res) => {
    try {
      removeAnimal(req.params.id);
      res.status(200).send("Se eliminó el animal con éxito");
    } catch (e) {
      res.status(400).send(e.message);
    }
  })
  .patch(tokenIsValid, (req, res) => {
    const { name, description } = req.body;
    const animal = getAnimal(req.params.id);
    if (!animal) {
      return res.status(404).send("Animal not found");
    }

    try {
      modAnimal(
        req.params.id,
        name || animal.name,
        description || animal.description
      );
      res.status(200).send("El animal se modificó correctamente");
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

// Checkpoint routes
app
  .route("/API/checkpoints")
  .get(tokenIsValid, (req, res) => {
    res.status(200).json(getAllCheckpoints());
  })
  .post(tokenIsValid, (req, res) => {
    const {
      id,
      lat,
      long,
      description = "Checkpoint sin descripción",
    } = req.body;
    if (!id || !lat || !long) {
      return res.status(400).send("Credenciales del checkpoint insuficientes");
    }

    try {
      addCheckpoint(id, lat, long, description);
      res.status(200).send("Checkpoint añadido con éxito");
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

app
  .route("/API/checkpoints/:id")
  .get(tokenIsValid, (req, res) => {
    const checkpoint = getCheckpoint(req.params.id);
    if (!checkpoint) {
      return res.status(400).send("Checkpoint inexistente");
    }
    res.status(200).json(checkpoint);
  })
  .delete(tokenIsValid, (req, res) => {
    try {
      removeCheckpoint(req.params.id);
      res.status(200).send("Se eliminó el checkpoint con éxito");
    } catch (e) {
      res.status(400).send(e.message);
    }
  })
  .patch(tokenIsValid, (req, res) => {
    const { lat, long, description } = req.body;
    const checkpoint = getCheckpoint(req.params.id);
    if (!checkpoint) {
      return res.status(404).send("Checkpoint not found");
    }

    try {
      modCheckpoint(
        req.params.id,
        lat || checkpoint.lat,
        long || checkpoint.long,
        description || checkpoint.description
      );
      res.status(200).send("El checkpoint se modificó correctamente");
    } catch (e) {
      res.status(400).send(e.message);
    }
  });

// Start the server
app.listen(HTTP_PORT, () => {
  console.log(`API con express corriendo en ${HTTP_PORT}`);
});

// Helper functions to generate tokens
function accessToken(username) {
  return tokenGenerator(username, 3600); // 1h
}

function refreshToken(username) {
  return tokenGenerator(username, 86400); // 24h
}

function tokenGenerator(username, seconds) {
  const data = {
    username,
    exp: Math.floor(Date.now() / 1000) + seconds,
  };
  return jwt.sign(data, secret);
}
