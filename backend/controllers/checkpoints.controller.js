import {
  getCheckpoints,
  getOneCheckpoint,
  writeCheckpoints,
  deleteCheckpoint,
  modifyCheckpoint,
} from "../repositories/checkpoints.repositories.js";

// Devuelve un array con todos los checkpoints
export const getAllCheckpoints = () => {
  return getCheckpoints();
};

// Devuelve un checkpoint en base a su id
export const getCheckpoint = (id) => {
  return getOneCheckpoint(id);
};

// Escribe un checkpoint en el archivo
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

// Modifica un checkpoint en base a su id
export const modCheckpoint = (id, lat, long, description) => {
  const checkpoint = {
    id,
    lat,
    long,
    description,
  };
  modifyCheckpoint(checkpoint);
};

// Elimina un checkpoint en base a su id
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
