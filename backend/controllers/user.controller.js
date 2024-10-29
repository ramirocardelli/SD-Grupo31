import { getUsers } from "../repositories/users.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const login = (user, pass) => {
  const usuario = {
    name: user,
    password: pass,
  };
  // TODO: Esto está mal. "registrado" es un boolean, no tiene atributo password.
  const registrado = getUser(usuario);
  if (registrado) {
    if (registrado.password != pass) throw new Error("contraseña incorrecta");
  } else {
    throw new Error("usuario inexistente");
  }
};

// No tenemos que registrar usuarios
//se intenta agregar un usuario, preguntando antes si existe, si existiera
//se lanza una excepcion y el index la maneja, si no se continua con el flujo y se
//agrega el usuario
/*
export const register = (user, pass) => {
  const usuario = {
    id: uuidv4(),
    name: user,
    password: pass,
  };
  if (!userExists(usuario)) {
    writeUser(usuario);
  } else {
    throw new Error("usuario existente");
  }
};
*/

// TODO, las contraseñas deberían estar hasheadas
function getUser(user) {
  const users = getUsers();

  return users.find((u) => u.name === user.name);
}
