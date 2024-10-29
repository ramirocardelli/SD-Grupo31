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
  const checkpoint = checkpoints.find((a) => a.id === id);
  return checkpoint;
};

export const writeCheckpoints = (checkpoint) => {
  const checkpoints = getCheckpoints();
  checkpoints.push(checkpoint);
  writeFileSync(FILE_PATH, JSON.stringify(checkpoints, null, 2));
};

export const deleteCheckpoint = (id) => {
  const resultado = getCheckpoints();
  const vec = resultado.filter((a) => a.id !== id);
  writeFileSync(FILE_PATH, JSON.stringify(vec, null, 2));
};

export const modifyCheckpoint = (checkpoint) => {
  const resultado = getCheckpoints();
  const index = resultado.findIndex((a) => a.id === checkpoint.id);
  resultado[index] = checkpoint;
  writeFileSync(FILE_PATH, JSON.stringify(resultado, null, 2));
};
