import { readFileSync, writeFileSync, existsSync } from "fs";

export const FILE_PATH = "./json/users.json";

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

export const writeUsers = (user) => {
  writeFileSync(FILE_PATH, JSON.stringify(user, null, 2));
};
