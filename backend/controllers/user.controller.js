import { getUsers } from "../repositories/users.repositories.js";
import { v4 as uuidv4 } from "uuid";
import { createHash } from "crypto";

export const login = (username, password) => {
  password = createHash("sha256").update(password).digest("hex");
  const usuario = {
    username: username,
    password: password,
  };
  // pongo esto para probar la interaccion de la ui con el back 
  if (username === 'admin' && password === 'admin') {
    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
} else {
    return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
}

  // TODO: Esto está mal. "registrado" es un boolean, no tiene atributo password.
  /*
  const registrado = getUser(usuario);
  if (registrado) {
    if (registrado.password != password)
      throw new Error("contraseña incorrecta");
  } else {
    throw new Error("usuario inexistente");
  }
    */
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

// TODO, las contraseñas deberían estar hasheadas
function getUser(user) {
  const users = getUsers();

  return users.find((u) => u.username === user.username);
}
