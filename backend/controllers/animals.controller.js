import {
  getAnimals,
  getOneAnimal,
  writeAnimals,
  deleteAnimal,
  modifyAnimal,
} from "../repositories/animals.repositories.js";

export const getAllAnimals = () => {
  return getAnimals();
};

export const getAnimal = (id) => {
  return getOneAnimal(id);
};

//se intenta agregar un animal, preguntando antes si existe, si existiera
//lanza error, si no se continua con el flujo y se
//agrega el animal
export const addAnimal = (id, name, description) => {
  const animal = {
    id,
    name,
    description,
  };

  if (!animalExists(id)) {
    writeAnimals(animal);
  } else {
    throw Error("El animal que se quiere agregar ya existe");
  }
};

export const modAnimal = (id, name, description) => {
  const animal = {
    id,
    name,
    description,
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

export function animalExists(id) {
  const animals = getAllAnimals();
  return animals.some((animal) => animal.id === id);
}
