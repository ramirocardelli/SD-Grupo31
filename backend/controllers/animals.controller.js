import {
  getAnimals,
  getOneAnimal,
  writeAnimals,
  deleteAnimal,
  modifyAnimal,
} from "../repositories/animals.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const getAllAnimals = () => {
  const result = getAnimals();
  return result;
};

export const getAnimal = (id) => {
  const result = getOneAnimal(id);
  return result;
};

//se intenta agregar un animal, preguntando antes si existe, si existiera
//lanza error, si no se continua con el flujo y se
//agrega el animal
export const addAnimal = (name, description) => {
  const animal = {
    id: uuidv4(),
    name: name,
    description: description,
  };
  if (!animalExists(animal.name)) {
    writeAnimals(animal);
  } else {
    throw Error("animal inexistente");
  }
};

export const modAnimal = (name, description) => {
  const animal = {
    id: uuidv4(),
    name: name,
    description: description,
  };
  if (animalExists(name)) {
    modifyAnimal(animal);
  } else {
    throw Error("animal inexistente");
  }
};

export const removeAnimal = (name) => {
  if (animalExists(name)) {
    deleteAnimal(name);
  } else throw new Error("no existe animal con ese nombre");
};

function animalExists(name) {
  const animals = getAllAnimals();
  return animals.some((animal) => animal.name === name);
}
