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


export const getOneCheckpoint = (name)  => {
  const checkpoints = getCheckpoints();
  const checkpoint = checkpoints.find((a) => a.name === name);
  return checkpoint || null; 
};


export const writeCheckpoints = (checkpoint) => {
  const checkpoints = getCheckpoints();
  checkpoints.push(checkpoint);
  writeFileSync(FILE_PATH, JSON.stringify(checkpoints, null, 2));
};

export const deleteCheckpoint = (name) => {
  const resultado = getCheckpoints();
  const vec = [];
  for (let i = 0; i < resultado.length; i++) {
    if (resultado[i].name != name) {
      vec.push(resultado[i]);
    }
  }
  writeFileSync(FILE_PATH, JSON.stringify(vec, null, 2));
};

export const modifyCheckpoint = (checkpoint) => {
  const resultado = getCheckpoints();
  for (let i = 0; i < resultado.length; i++) {
    if (resultado[i].name == checkpoint.name) {
      resultado[i].description = checkpoint.description;
      break;
    }
  }
  writeFileSync(FILE_PATH, JSON.stringify(resultado, null, 2));
};
