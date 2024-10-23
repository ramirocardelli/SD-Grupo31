import {
  getCheckpoints,
  writeCheckpoints,
  deleteCheckpoint,
  modifyCheckpoint,
} from "../repositories/checkpoints.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const getAllCheckpoints = () => {
  const result = getCheckpoints();
  return result;
};
//se intenta agregar un checkpoint, preguntando antes si existe, si existiera
//se MODIFICA el checkpoint, si no se continua con el flujo y se
//agrega el checkpoint
export const addCheckpoint = (name, description) => {
  const checkpoint = {
    uuid: uuidv4(),
    name: name,
    description: description,
  };
  if (!existCheckpoint(checkpoint.name)) {
    writeCheckpoints(checkpoint);
  } else {
    throw Error("checkpoint inexistente");
  }
};

export const modCheckpoint = (name, description) => {
  const checkpoint = {
    uuid: uuidv4(),
    name: name,
    description: description,
  };
  if (existCheckpoint(checkpoint.name)) {
    modifyCheckpoint(checkpoint);
  } else {
    throw Error("checkpoint inexistente");
  }
};

export const removeCheckpoint = (name) => {
  if (existCheckpoint(name)) {
    deleteCheckpoint(name);
  } else throw new Error("no existe checkpoint con ese nombre");
};

//documentar
function existCheckpoint(name) {
  const checkpoints = getAllCheckpoints();
  for (let i = 0; i < checkpoints.length; i++) {
    if (checkpoints[i].name == name) return false;
  }
  return true;
}
