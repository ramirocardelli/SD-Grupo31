import mqtt from "mqtt";
import { getAllCheckpoints } from "./checkpoints.controller.js";
import { getAllAnimals, animalExists } from "./animals.controller.js";
const options = {
  username: "xd",
  password: "xd",
  clientID: "adminID",
};
const client = mqtt.connect("mqtt://192.168.0.247:1883", options);
const umbral = -50;
//mapa = {checkpoint.id,[vector de animales]}
const posiciones = new Map();

//Creamos un mapa para cada checkpoint y el listado VACIO de los animales que pertencen a el
const checkpoints = getAllCheckpoints();
checkpoints.forEach((checkpoint) => {
  const datos = {
    id: checkpoint.id,
    lat: checkpoint.lat,
    long: checkpoint.long,
    description: checkpoint.description,
    animals: [],
  };
  posiciones.set(checkpoint.id, datos);
});
//esta funcion se ejecuta en el index, lo que hace es quedarse escuchando el topico y
//se conecta al broker
export function connectToBroker() {
  client.on("connect", () => {
    client.subscribe("checkpoint", (err) => {
      if (!err) {
      }
    });
    console.log("[DEBUG]" + " conexion a topico checkpoint");
  });
}

//funcion para obtener el mapa con posiciones
export function getPosiciones() {
  return posiciones;
}
//El mensaje esperado es un checkpoint ID y un vector de animales que pertenecen a el
client.on("message", (topic, message) => {
  // message is Buffer
  const messageString = message.toString(); // para que salgan los caracteres como ascii
  console.log(
    "[DEBUG]: " + JSON.stringify({ mensaje: messageString, topico: topic })
  );
  if (topic === "checkpoint") {
    //console.log(message.toString());
    actualizarPosicion(message.toString());
    //console.log(posiciones);
    //client.end();
  }
});

//si llega un mensaje con un checkpoint y los animales que pertencen a el, se actualiza en el mapa
function actualizarPosicion(mensaje) {
  try {
    mensaje = JSON.parse(mensaje);
    const animalesRecibidos = mensaje?.animals;
    const vec = animalesRecibidos.filter(
      (animal) => animalExists(animal.id) && animal.rssi >= umbral
    );

    if (mensaje?.checkpointID) {
      if (posiciones.has(mensaje.checkpointID)) {
        posiciones.get(mensaje.checkpointID).animals = vec;
      }
    }
  } catch (e) {}
}

client.on("error", (err) => {
  //TODO que pasa si hay un error entre las raspberry y el broker
});