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

export const getOneAnimal = (id) => {
  const animals = getAnimals();
  const animal = animals.find((a) => a.id === id);
  return animal || null;
};

export const writeAnimals = (animal) => {
  const resultado = getAnimals();
  resultado.push(animal);
  writeFileSync(FILE_PATH, JSON.stringify(resultado, null, 2));
};

export const deleteAnimal = (name) => {
  const resultado = getAnimals();
  const vec = [];
  for (let i = 0; i < resultado.length; i++) {
    if (resultado[i].name != name) {
      vec.push(resultado[i]);
    }
  }
  writeFileSync(FILE_PATH, JSON.stringify(vec, null, 2));
};

export const modifyAnimal = (animal) => {
  const resultado = getAnimals();
  for (let i = 0; i < resultado.length; i++) {
    if (resultado[i].name == animal.name) {
      resultado[i].description = animal.description;
      break;
    }
  }
  writeFileSync(FILE_PATH, JSON.stringify(resultado, null, 2));
};
