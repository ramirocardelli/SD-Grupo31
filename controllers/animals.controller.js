import {
  getAnimals,
  writeAnimals,
  deleteAnimal,
  modifyAnimal,
} from "../repositories/animals.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const getAllAnimals = () => {
  const result = getAnimals();
  return result;
};
//se intenta agregar un animal, preguntando antes si existe, si existiera
//lanza error, si no se continua con el flujo y se
//agrega el animal
export const addAnimal = (name, description) => {
  const animal = {
    uid: uuidv4(),
    name: name,
    description: description,
  };
  if (existAnimal(animal.name)) {
    writeAnimals(animal);
  } else {
    throw Error("animal inexistente");
  }
};

export const modAnimal = (name, description) => {
  const animal = {
    uid: uuidv4(),
    name: name,
    description: description,
  };
  if (existAnimal(animal.name)) {
    modifyAnimal(animal);
  } else {
    throw Error("animal inexistente");
  }
};

export const removeAnimal = (name) => {
  if (!existAnimal(name)) {
    deleteAnimal(name);
  } else throw new Error("no existe animal con ese nombre");
};

//documentar
function existAnimal(name) {
  const animales = getAllAnimals();
  for (let i = 0; i < animales.length; i++) {
    if (animales[i].name == name) return false;
  }
  return true;
}
