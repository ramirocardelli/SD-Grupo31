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
export const addAnimal = (id, name, description) => {
  const animal = {
    id: id,
    name: name,
    description: description,
  };
  if (!animalExists(id)) {
    writeAnimals(animal);
  } else {
    throw Error("El animal que se quiere agregar ya existe");
  }
};

export const modAnimal = (name, description) => {
  const animal = {
    id: uuidv4(),
    name: name,
    description: description,
  };
  if (animalExists(id)) {
    modifyAnimal(animal);
  } else {
    throw Error("No existe el animal a modificar");
  }
};

export const removeAnimal = (id) => {
  if (animalExists(id)) {
    deleteAnimal(id);
  } else throw new Error("No existe el animal a eliminar");
};

function animalExists(id) {
  const animals = getAllAnimals();
  return animals.some((animal) => animal.id === id);
}
