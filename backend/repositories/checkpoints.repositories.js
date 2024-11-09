import { readFileSync, writeFileSync, existsSync } from "fs";
import "dotenv/config";

const FILE_PATH = process.env.CHECKREP;

export const getCheckpoints = () => {
  const fileExist = existsSync(FILE_PATH);
  if (fileExist) {
    const file = readFileSync(FILE_PATH, "utf-8");
    const parsedFile = JSON.parse(file);
    return parsedFile;
  } else {
    return [];
  }
};

export const getOneCheckpoint = (id) => {
  const checkpoints = getCheckpoints();
  return checkpoints.find((a) => a.id === id);
};

export const writeCheckpoints = (checkpoint) => {
  const checkpoints = getCheckpoints();
  checkpoints.push(checkpoint);
  try {
    writeFileSync(FILE_PATH, JSON.stringify(checkpoints, null, 2));
  } catch (error) {
    console.error("Error al escribir el archivo:", error);
  }
};

export const deleteCheckpoint = (id) => {
  let checkpoints = getCheckpoints();
  checkpoints = checkpoints.filter((a) => a.id !== id);
  writeFileSync(FILE_PATH, JSON.stringify(checkpoints, null, 2));
};

export const modifyCheckpoint = (checkpoint) => {
  const checkpoints = getCheckpoints();
  const i = checkpoints.findIndex((a) => a.id === checkpoint.id);
  if (i === -1) {
    throw new Error("No existe el checkpoint a modificar");
  }
  checkpoints[i] = checkpoint;
  writeFileSync(FILE_PATH, JSON.stringify(checkpoints, null, 2));
};
