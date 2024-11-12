import { readFileSync, writeFileSync, existsSync } from "fs";
import "dotenv/config";

const FILE_PATH = process.env.USERREP;

// Devuelve un array con todos los usuarios
export const getUsers = () => {
  const fileExist = existsSync(FILE_PATH);
  if (fileExist) {
    const file = readFileSync(FILE_PATH, "utf-8");
    const parsedFile = JSON.parse(file);
    return parsedFile;
  } else {
    return [];
  }
};

// Devuelve un usuario en base a su id
export const writeUser = (user) => {
  const users = getUsers();
  users.push(user);
  writeFileSync(FILE_PATH, JSON.stringify(users, null, 2));
};
