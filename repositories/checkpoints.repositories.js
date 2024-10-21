import { readFileSync, writeFileSync, existsSync } from "fs";

export const FILE_PATH = "./json/checkpoints.json";

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

export const writeCheckpoints = (checkpoint) => {
  const checkpoints = getCheckpoints();
  checkpoints.push(checkpoint);
  writeFileSync(FILE_PATH, JSON.stringify(checkpoints, null, 2));
};
