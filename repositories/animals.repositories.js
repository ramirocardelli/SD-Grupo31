import { readFileSync, writeFileSync, existsSync } from "fs";
import "dotenv/config";

const FILE_PATH = process.env.ANIMREP;

export const getAnimals = () => {
  const fileExist = existsSync(FILE_PATH);
  if (fileExist) {
    const file = readFileSync(FILE_PATH, "utf-8");
    const parsedFile = JSON.parse(file);
    return parsedFile;
  } else {
    return [];
  }
};

export const writeAnimals = (animal) => {
  const resultado = getAnimals();
  resultado.push(animal);
  writeFileSync(FILE_PATH, JSON.stringify(resultado, null, 2));
};
