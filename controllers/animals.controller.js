import { getAnimals } from "../repositories/animals.repositories.js";

export const getAllAnimals = (req, res) => {
  try {
    const result = getAnimals();
    res.setHeader("Content-Type", "application/json");
    const response = {
      data: result,
    };
    res.end(JSON.stringify(response));
  } catch (e) {
    console.log(e);
  }
};

export const addAnimal = (game) => {};
