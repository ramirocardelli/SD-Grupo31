import { getUsers } from "../repositories/users.repositories.js";
import { createHash } from "crypto";

export const login = (username, password) => {
  password = createHash("sha256").update(password).digest("hex");
  const user = {
    username,
    password,
  };

  const registered = getUser(user);
  if (registered) {
    if (registered.password != password) throw new Error("Incorrect password");
  } else {
    throw new Error("User not found");
  }
};

// No tenemos que registrar usuarios
//se intenta agregar un usuario, preguntando antes si existe, si existiera
//se lanza una excepcion y el index la maneja, si no se continua con el flujo y se
//agrega el usuario
/*
export const register = (username, pass) => {
  const usuario = {
    id: uuidv4(),
    username: username,
    password: pass,
  };
  if (!userExists(usuario)) {
    writeUser(usuario);
  } else {
    throw new Error("usuario existente");
  }
};
*/

function getUser(user) {
  return getUsers().find((u) => u.username === user.username);
}
