import { readFileSync, writeFileSync, existsSync } from "fs";
import "dotenv/config";
import path from "path";

const FILE_PATH = path.resolve(process.env.ANIMREP);

// Devuelve un array con todos los animales
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

// Devuelve un animal en base a su id
export const getOneAnimal = (id) => {
  const animals = getAnimals();
  return animals.find((a) => a.id === id);
};

// Escribe un animal en el archivo
export const writeAnimals = (animal) => {
  const animals = getAnimals();
  animals.push(animal);
  try {
    writeFileSync(FILE_PATH, JSON.stringify(animals, null, 2));
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
  }
};

// Elimina un animal en base a su id
export const deleteAnimal = (id) => {
  let animals = getAnimals();
  animals = animals.filter((a) => a.id !== id);
  writeFileSync(FILE_PATH, JSON.stringify(animals, null, 2));
};

// Modifica un animal en base a su id
export const modifyAnimal = (animal) => {
  const animals = getAnimals();
  const i = animals.findIndex((a) => a.id === animal.id);
  if (i === -1) {
    throw new Error("No existe el animal a modificar");
  }
  animals[i] = animal;
  writeFileSync(FILE_PATH, JSON.stringify(animals, null, 2));
};

// Comprueba si un animal existe en base a su id
export function animalExists(id) {
  return getAnimals().some((animal) => animal.id === id);
}
