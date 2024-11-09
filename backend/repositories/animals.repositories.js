import { readFileSync, writeFileSync, existsSync } from "fs";
import "dotenv/config";
import path from "path";

const FILE_PATH = path.resolve(process.env.ANIMREP);

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
  return animals.find((a) => a.id === id);
};

export const writeAnimals = (animal) => {
  const animals = getAnimals();
  animals.push(animal);
  try {
    writeFileSync(FILE_PATH, JSON.stringify(animals, null, 2));
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
  }
};

export const deleteAnimal = (id) => {
  let animals = getAnimals();
  animals = animals.filter((a) => a.id !== id);
  writeFileSync(FILE_PATH, JSON.stringify(animals, null, 2));
};

export const modifyAnimal = (animal) => {
  const animals = getAnimals();
  const i = animals.findIndex((a) => a.id === animal.id);
  if (i === -1) {
    throw new Error("No existe el animal a modificar");
  }
  animals[i] = animal;
  writeFileSync(FILE_PATH, JSON.stringify(animals, null, 2));
};
