import {
  getAnimals,
  getOneAnimal,
  writeAnimals,
  deleteAnimal,
  modifyAnimal,
} from "../repositories/animals.repositories.js";

// Devuelve un array con todos los animales
export const getAllAnimals = () => {
  return getAnimals();
};

// Devuelve un animal en base a su id
export const getAnimal = (id) => {
  return getOneAnimal(id);
};

// Escribe un animal en el archivo
export const addAnimal = (id, name, description) => {
  const animal = {
    id,
    name,
    description,
  };
  if (!animalExists(id)) {
    writeAnimals(animal);
  } else {
    throw new Error("El animal que se quiere agregar ya existe");
  }
};

// Modifica un animal en base a su id
export const modAnimal = (id, name, description) => {
  const animal = {
    id,
    name,
    description,
  };
  if (animalExists(id)) {
    modifyAnimal(animal);
  } else {
    throw new Error("No existe el animal a modificar");
  }
};

// Elimina un animal en base a su id
export const removeAnimal = (id) => {
  if (animalExists(id)) {
    deleteAnimal(id);
  } else {
    throw new Error("No existe el animal a eliminar");
  }
};

// Comprueba si un animal existe en base a su id
export function animalExists(id) {
  return getAllAnimals().some((animal) => animal.id === id);
}
