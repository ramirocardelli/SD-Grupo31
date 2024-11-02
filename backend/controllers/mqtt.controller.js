import mqtt from "mqtt";
import { getAllCheckpoints } from "./checkpoints.controller.js";
import { animalExists } from "./animals.controller.js";
const avilableDevices = []
const options = {
  username: "admin",
  password: "admin",
  clientID: "adminID",
};
const mqttUrl = "mqtt://localhost:1883"
const client = mqtt.connect(mqttUrl, options);
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
    actualizarPosicion(messageString);
    //client.end();
  }
});

//si llega un mensaje con un checkpoint y los animales que pertencen a el, se actualiza en el mapa
function actualizarPosicion(mensaje) {
  try {
    mensaje = JSON.parse(mensaje);
    const animalesRecibidos = mensaje?.animals;
    const vec = []
    animalesRecibidos.forEach((animal) => {
      if (animalExists(animal.id) && animal.rssi >= umbral) {
        vec.push(animal);
      } else {
        if (!animalExists(animal.id) && !avilableDevices.includes(animal.id)){
          // creen comveniente ponerle un timestamp?
          avilableDevices.push(animal.id)
        }
      }
    });

    if (mensaje?.checkpointID) {
      if (posiciones.has(mensaje.checkpointID)) {
        posiciones.get(mensaje.checkpointID).animals = vec;
      }
    }
  } catch (e) {}
}

export function getAvilableAnimals(){
  return avilableDevices
}

client.on("error", (err) => {
  //TODO que pasa si hay un error entre las raspberry y el broker
});
