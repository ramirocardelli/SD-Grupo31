import mqtt from "mqtt";
import { getAllCheckpoints } from "./checkpoints.controller.js";
import { animalExists } from "./animals.controller.js";

let availableDevices = [];
const options = {
  username: "admin",
  password: "admin",
  clientID: "adminID",
};

const mqttUrl = "mqtt://192.168.0.247:1883";
const client = mqtt.connect(mqttUrl, options);
const threshold = -40;
//mapa = {checkpoint.id,[vector de animales]}
const positionsMap = new Map();

//Creamos un mapa para cada checkpoint y el listado VACIO de los animales que pertencen a el
const checkpoints = getAllCheckpoints();
checkpoints.forEach((checkpoint) => {
  const data = {
    lat: checkpoint.lat,
    long: checkpoint.long,
    description: checkpoint.description,
    animals: [],
  };
  positionsMap.set(checkpoint.id, data);
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
    updatePosition(messageString);
  }
});

client.on("error", (err) => {
  //TODO que pasa si hay un error entre las raspberry y el broker
});

//si llega un mensaje con un checkpoint y los animales que pertencen a el, se actualiza en el mapa
function updatePosition(message) {
  try {
    message = JSON.parse(message);
    console.log("[DEBUG]: " + JSON.stringify(message));
    const receivedAnimals = message?.animals;
    const arr = [];

    if (message?.packageNum == 1) {
      //es el primer paquete, hay que limpiar todo el checkpoint
      clearCheckpointAnimals(message?.checkpointId);
    }

    receivedAnimals.forEach((animal) => {
      if (animalExists(animal.id) && animal.rssi >= threshold) {
        deleteAnimalInstanceFromCheckpoints(animal.id, message.checkpointId);
        arr.push(animal);
      } else {
        if (!animalExists(animal.id) && !availableDevices.includes(animal.id)) {
          availableDevices.push(animal.id);
        }
      }
    });

    if (message?.checkpointId) {
      if (positionsMap.has(message.checkpointId)) {
        positionsMap.set(message.checkpointId).animals = arr;
      }
    }

    if (message?.packageNum == message?.totalPackages) {
      //actualizar frontend
      console.log("frontend actualizado");
    }
  } catch (e) {}
}

function deleteAnimalInstanceFromCheckpoints(animalId, checkpointId) {
  positionsMap.checkpointId((value, key) => {
    if (key != checkpointId) {
      value.animals = value.animals.filter((item) => item.id != animalId);
    }
  });
}

function clearCheckpointAnimals(checkpointId) {
  const checkpoint = positionsMap.get(checkpointId);

  if (checkpoint) {
    checkpoint.animals = []; // Vacia la lista de animales del checkpoint
    console.log(`Animales eliminados del checkpoint ${checkpointId}`);
  } else {
    console.log(`Checkpoint con ID ${checkpointId} no encontrado`);
  }
}

// Funcion para obtener el mapa con posiciones
export function getPositions() {
  return positionsMap;
}

// Funcion para obtener los animales registrables
export function getAvailableAnimals() {
  const obj = {
    devices: availableDevices,
  };
  return obj;
}

export function deleteAvailableDevice(id) {
  availableDevices = availableDevices.filter(
    (id_elemento) => !(id_elemento == id)
  );
}
