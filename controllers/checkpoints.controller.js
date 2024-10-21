import {
  getCheckpoints,
  writeCheckpoints,
} from "../repositories/checkpoints.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const getAllCheckpoints = () => {
  const result = getCheckpoints();
  return result;
};
//se intenta agregar un checkpoint, preguntando antes si existe, si existiera
//se lanza una excepcion y el index la maneja, si no se continua con el flujo y se
//agrega el checkpoint
export const addCheckpoint = (name, description) => {
  const checkpoint = {
    uuid: uuidv4(),
    name: name,
    description: description,
  };
  if (existCheckpoint(checkpoint)) {
    writeCheckpoints(checkpoint);
  } else {
    throw new Error("ya existe checkpoint con ese nombre");
  }
};

//documentar
function existCheckpoint(checkpoint) {
  const checkpoints = getAllCheckpoints();
  for (let i = 0; i < checkpoints.length; i++) {
    if (checkpoints[i].name == checkpoint.name) return false;
  }
  return true;
}
