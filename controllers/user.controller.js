import { getUsers, writeUser } from "../repositories/users.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const loginUser = (user, pass) => {
  const usuarios = getUsers();
  let i = 0;
  const registrado = existUser(user);
  if (registrado) {
    if (registrado.password != pass) throw new Error("contraseña incorrecta");
  } else {
    throw new Error("usuario inexistente");
  }
};
//se intenta agregar un usuario, preguntando antes si existe, si existiera
//se lanza una excepcion y el index la maneja, si no se continua con el flujo y se
//agrega el usuario
export const registerUser = (user, pass) => {
  const usuario = {
    uuid: uuidv4(),
    name: user,
    password: pass,
  };
  if (existUser(usuario)) {
    throw new Error("usuario existente");
  } else {
    writeUser(usuario);
  }
};

function existUser(user) {
  let i = 0;
  const usuarios = getUsers();
  for (i; i < usuarios.length; i++) {
    if (usuarios[i].name == user.name) return true;
  }
  return false;
}
