import { getUsers } from "../repositories/users.repositories.js";
import { createHash } from "crypto";

export const login = (username, password) => {
  // Si el usuario y contraseña son incorrectos, lanza una excepción
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

function getUser(user) {
  return getUsers().find((u) => u.username === user.username);
}
