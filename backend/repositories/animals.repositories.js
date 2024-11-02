import { readFileSync, writeFileSync, existsSync } from "fs";
import "dotenv/config";
import path from 'path';

const FILE_PATH = path.resolve(process.env.ANIMREP);
console.log(FILE_PATH);

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
  try {
    writeFileSync(FILE_PATH, JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
  }
};

export const deleteAnimal = (id) => {
  const resultado = getAnimals();
  const vec = resultado.filter((a) => a.id !== id);
  writeFileSync(FILE_PATH, JSON.stringify(vec, null, 2));
};

export const modifyAnimal = (animal) => {
  const animals = getAnimals();
  const index = animals.findIndex((a) => a.id === animal.id);
  if (index === -1) {
    throw new Error("No existe el animal a modificar");
  }
  animals[index] = animal;
  writeFileSync(FILE_PATH, JSON.stringify(animals, null, 2));
};
