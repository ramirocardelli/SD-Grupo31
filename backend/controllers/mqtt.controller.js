import mqtt from "mqtt";
import { getAllCheckpoints } from "./checkpoints.controller.js";
import { animalExists } from "./animals.controller.js";
const avilableDevices = []
const options = {
  username: "admin",
  password: "admin",
  clientID: "adminID",
};
const mqttUrl = "mqtt://192.168.56.1:1883"
const client = mqtt.connect(mqttUrl, options);
const umbral = -50;
//mapa = {checkpoint.id,[vector de animales]}
const posiciones = new Map();

//Creamos un mapa para cada checkpoint y el listado VACIO de los animales que pertencen a el
const checkpoints = getAllCheckpoints();
checkpoints.forEach((checkpoint) => {
  const datos = {
    lat: checkpoint.lat,
    long: checkpoint.long,
    description: checkpoint.description,
    animals: [],
  };
  posiciones.set(checkpoint.id, datos);
});

export function connectToBroker() {
  client.on("connect", () => {
    client.subscribe("checkpoint", (err) => {
      if (!err) {
      }
    });
    console.log("[DEBUG]" + " conexion a topico checkpoint");
  });
}

client.on("message", (topic, message) => {
  const messageString = message.toString().replaceAll("'",'"'); // para que salgan los caracteres como ascii
  if (topic === "checkpoint") {
    actualizarPosicion(messageString);
  }
});

client.on("error", (err) => {
  //TODO que pasa si hay un error entre las raspberry y el broker
});

//si llega un mensaje con un checkpoint y los animales que pertencen a el, se actualiza en el mapa
function actualizarPosicion(mensaje) {
  try {
    mensaje = JSON.parse(mensaje);
    console.log("[DEBUG]: " + mensaje);
    const animalesRecibidos = mensaje?.animals;
    const vec = []

    animalesRecibidos.forEach((animal) => {
      if (animalExists(animal.id) && animal.rssi >= umbral) {
        deleteAnimalInstanceFromCheckpoints(animal.id,mensaje.checkpointID)
        vec.push(animal);
      } else {
        if (!animalExists(animal.id) && !avilableDevices.includes(animal.id)){
          avilableDevices.push(animal.id,mensaje.checkpointID)
        }
      }
    });

    if (mensaje?.checkpointID) {
      if (posiciones.has(mensaje.checkpointID)) {
        posiciones.set(mensaje.checkpointID).animals = vec;
      }
    }
  } catch (e) {}
}

function deleteAnimalInstanceFromCheckpoints(animalID,checkpointID){
posiciones.forEach((value,key)=>{
  if (key!=checkpointID){
    value.animals=value.animals.filter(item => item.id != animalID);
  }
});
}

//funcion para obtener el mapa con posiciones
export function getPosiciones() {
  return posiciones;
}
//funcion para obtener los animales registrables
export function getAvilableAnimals(){
  const obj={
    devices:avilableDevices
  }
  return obj
}