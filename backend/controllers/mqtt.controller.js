import mqtt from "mqtt";
import { getAllCheckpoints } from "./checkpoints.controller.js";
import { animalExists } from "./animals.controller.js";
const avilableDevices = [];
const options = {
  username: "admin",
  password: "admin",
  clientID: "adminID",
};
const mqttUrl = "mqtt://192.168.0.247:1883";
const client = mqtt.connect(mqttUrl, options);
const umbral = -40;
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
  const messageString = message.toString();
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
    console.log("[DEBUG]: " + JSON.stringify(mensaje));
    const animalesRecibidos = mensaje?.animals;
    const vec = [];

    if (mensaje?.packageNum == 1){
      //es el primer paquete, hay que limpiar todo el checkpoint
      clearAnimalsFromCheckpoint(mensaje?.checkpointID)
    }

    animalesRecibidos.forEach((animal) => {
      if (animalExists(animal.id) && animal.rssi >= umbral) {
        deleteAnimalInstanceFromCheckpoints(animal.id, mensaje.checkpointID);
        vec.push(animal);
      } else {
        if (!animalExists(animal.id) && !avilableDevices.includes(animal.id)) {
          avilableDevices.push(animal.id);
        }
      }
    });

    if (mensaje?.checkpointID) {
      if (posiciones.has(mensaje.checkpointID)) {
        posiciones.set(mensaje.checkpointID).animals = vec;
      }
    }

    if (mensaje?.packageNum == mensaje?.totalPackages){
      //actualizar frontend
      console.log("frontend actualizado")
    }
  } catch (e) {}
}

function deleteAnimalInstanceFromCheckpoints(animalID, checkpointID) {
  posiciones.forEach((value, key) => {
    if (key != checkpointID) {
      value.animals = value.animals.filter((item) => item.id != animalID);
    }
  });
}

function clearAnimalsFromCheckpoint(checkpointID) {
  const checkpoint = posiciones.get(checkpointID);
  
  if (checkpoint) {
    checkpoint.animals = []; // Vacia la lista de animales del checkpoint
    console.log(`Animales eliminados del checkpoint ${checkpointID}`);
  } else {
    console.log(`Checkpoint con ID ${checkpointID} no encontrado`);
  }
}




//funcion para obtener el mapa con posiciones
export function getPosiciones() {
  return posiciones;
}
//funcion para obtener los animales registrables
export function getAvilableAnimals() {
  const obj = {
    devices: avilableDevices,
  };
  return obj;
}

export function deleteAvilableDevice(id){
    const newArray = avilableDevices.filter(id_elemento => !(id_elemento==id));
    avilableDevices = newArray
}
