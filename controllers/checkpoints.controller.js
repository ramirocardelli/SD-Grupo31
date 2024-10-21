import { getCheckpoints } from "../repositories/checkpoints.repositories.js";

export const getAllCheckpoints = (req, res) => {
  try {
    const result = getCheckpoints();
    res.setHeader("Content-Type", "application/json");
    const response = {
      data: result,
    };
    res.end(JSON.stringify(response));
  } catch (e) {
    console.log(e);
    res.writeHead(500);
    res.end("Error");
  }
};

export const addCheckpoint = (game) => {};
