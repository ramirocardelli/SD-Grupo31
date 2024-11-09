import {
  getCheckpoints,
  getOneCheckpoint,
  writeCheckpoints,
  deleteCheckpoint,
  modifyCheckpoint,
} from "../repositories/checkpoints.repositories.js";

export const getAllCheckpoints = () => {
  return getCheckpoints();
};

export const getCheckpoint = (id) => {
  return getOneCheckpoint(id);
};

//se intenta agregar un checkpoint, preguntando antes si existe, si existiera
//se MODIFICA el checkpoint, si no se continua con el flujo y se
//agrega el checkpoint
export const addCheckpoint = (id, lat, long, description) => {
  const checkpoint = {
    id,
    lat,
    long,
    description,
  };
  if (!checkpointExists(id)) {
    writeCheckpoints(checkpoint);
  } else {
    throw Error("El checkpoint que se quiere agregar ya existe");
  }
};

export const modCheckpoint = (id, lat, long, description) => {
  const checkpoint = {
    id,
    lat,
    long,
    description,
  };
  if (checkpointExists(id)) {
    modifyCheckpoint(checkpoint);
  } else {
    throw Error("No existe el punto de control a modificar");
  }
};

export const removeCheckpoint = (id) => {
  if (checkpointExists(id)) {
    deleteCheckpoint(id);
  } else throw new Error("No existe el punto de control a eliminar");
};

//funcion que verifica si el checkpoint existe
function checkpointExists(id) {
  const checkpoints = getAllCheckpoints();
  return checkpoints.some((checkpoint) => checkpoint.id === id);
}
