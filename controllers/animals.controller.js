import {
  getAnimals,
  writeAnimals,
} from "../repositories/animals.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const getAllAnimals = () => {
  const result = getAnimals();
  return result;
};
//se intenta agregar un animal, preguntando antes si existe, si existiera
//se lanza una excepcion y el index la maneja, si no se continua con el flujo y se
//agrega el animal
export const addAnimal = (name, description) => {
  const animal = {
    uid: uuidv4(),
    name: name,
    description: description,
  };
  if (existAnimal(animal)) {
    writeAnimals(animal);
  } else throw new Error("ya existe animal con ese nombre");
};

//documentar
function existAnimal(animal) {
  const animales = getAllAnimals();
  for (let i = 0; i < animales.length; i++) {
    if (animales[i].name == animal.name) return false;
  }
  return true;
}
