import mqtt from "mqtt";
import { getAllCheckpoints } from "./checkpoints.controller.js";
import { animalExists } from "./animals.controller.js";
import { sendSSE } from "./sse.controller.js";

let availableDevices = [];
const options = {
  username: "admin",
  password: "admin",
  clientID: "adminID",
};

const mqttUrl = "mqtt://192.168.56.1:1883";
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
function updatePosition(mess) {
  try {
    const message = JSON.parse(mess);
    const receivedAnimals = message?.animals;
    const animals = [];

    if (message?.packageNum == 1) {
      //es el primer paquete, hay que limpiar todo el checkpoint
      clearCheckpointAnimals(message?.checkpointID);
    }

    receivedAnimals?.forEach((animal) => {
      if (animalExists(animal.id) && animal.rssi >= threshold) {
        deleteAnimalInstanceFromCheckpoints(animal.id, message?.checkpointID);
        animals.push(animal);
      } else {
        if (!animalExists(animal.id) && !availableDevices.includes(animal.id)) {
          availableDevices.push(animal.id);
        }
      }
    });

    if (message?.checkpointID) {
      if (positionsMap.has(message.checkpointID)) {
        const checkpoint = positionsMap.get(message.checkpointID)
        checkpoint.animals = animals;
        positionsMap.set(message.checkpointID, checkpoint);
      }
    }

    if (message?.packageNum == message?.totalPackages) {
      console.log("XDXDXDXDXD")
      sendSSE(getPositions());
    }
  } catch (e) {
    console.log(e)
  }
}

function deleteAnimalInstanceFromCheckpoints(animalId, checkpointId) {
  positionsMap.forEach((value, key) => {
    if (key != checkpointId) {
      value.animals = value.animals.filter((a) => a.id != animalId);
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
  const positions = [];
  positionsMap.forEach((value, key) => {
    const obj = {
      id: key,
      lat: value.lat,
      long: value.long,
      description: value.description,
      animals: value.animals,
    };
    positions.push(obj);
  });
  return positions;
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
