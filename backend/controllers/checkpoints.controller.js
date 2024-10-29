import {
  getCheckpoints,
  getOneCheckpoint,
  writeCheckpoints,
  deleteCheckpoint,
  modifyCheckpoint,
} from "../repositories/checkpoints.repositories.js";
import { v4 as uuidv4 } from "uuid";

export const getAllCheckpoints = () => {
  const result = getCheckpoints();
  return result;
};

export const getCheckpoint = (name) => {
  const result = getOneCheckpoint(name);
  return result;
};

//se intenta agregar un checkpoint, preguntando antes si existe, si existiera
//se MODIFICA el checkpoint, si no se continua con el flujo y se
//agrega el checkpoint
export const addCheckpoint = (name, description) => {
  const checkpoint = {
    id: uuidv4(),
    name: name,
    description: description,
  };
  if (!checkpointExists(checkpoint.name)) {
    writeCheckpoints(checkpoint);
  } else {
    // si ya existe se modifica
    modifyCheckpoint(checkpoint);
  }
};

export const modCheckpoint = (name, description) => {
  const checkpoint = {
    id: uuidv4(),
    name: name,
    description: description,
  };
  if (checkpointExists(checkpoint.name)) {
    modifyCheckpoint(checkpoint);
  } else {
    throw Error("checkpoint inexistente");
  }
};

export const removeCheckpoint = (name) => {
  if (checkpointExists(name)) {
    deleteCheckpoint(name);
  } else throw new Error("no existe checkpoint con ese nombre");
};

//funcion que verifica si el checkpoint existe
function checkpointExists(name) {
  const checkpoints = getAllCheckpoints();
  return checkpoints.some((checkpoint) => checkpoint.name === name);
}
