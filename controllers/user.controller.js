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
export const registerUser = (user, pass) => {
  if (existUser(user)) {
    throw new Error("usuario existente");
  } else {
    const usuario = {
      uuid: uuidv4(),
      name: user,
      password: pass,
    };
    writeUser(usuario);
  }
};

function existUser(name) {
  let i = 0;
  const usuarios = getUsers();
  for (i; i < usuarios.length; i++) {
    if (usuarios[i].name == name) return usuarios[i];
  }
  return false;
}
