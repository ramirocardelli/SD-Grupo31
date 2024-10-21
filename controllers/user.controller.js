import { getUsers, writeUser } from "../repositories/users.repositories.js";
import { v4 as uuidv4 } from "uuid";
export const loginUser = (req, res, user, pass) => {
  const usuarios = getUsers();
  for (let i = 0; i < usuarios.length; i++) {
    if (usuarios[i].name == user) {
      if (usuarios[i].password == pass) {
        return true;
      } else {
        res.writeHead(401, "constraseña invalida");
        res.statusCode = 401;
        res.end();
        return false;
      }
    }
  }
  res.writeHead(401, "Usuario inexistente");
  res.statusCode = 401;
  res.end();
  return false;
};
export const registerUser = (req, res, user, pass) => {
  const usuarios = getUsers();
  usuarios.forEach((element) => {
    if (element.name == user) {
      res.writeHead(401, "usuario ya registrado");
      res.statusCode = 401;
      res.end();
    }
  });
  const usuario = {
    uuid: uuidv4(),
    name: user,
    password: pass,
  };
  writeUser(usuario);
  res.writeHead(200, "Usuario registrado");
  res.statusCode = 200;
  res.end();
};
