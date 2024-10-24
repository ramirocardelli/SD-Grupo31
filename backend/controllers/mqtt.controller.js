import mqtt from "mqtt";
import { getAllAnimals } from "./animals.controller.js";
const client = mqtt.connect("mqtt://localhost:1883");
//mapa = {nombre_animal,[pos.x,pos.y]}
const posiciones = new Map();

//Creamos un mapa donde tiene para cada nombre de animal, sus posiciones en X e Y
//la posicion inicial es 0,0, pero se va actualizando a medida que le llegan mensajes
const animals = getAllAnimals();
animals.forEach((animal) => {
  const pos = [0, 0];
  posiciones.set(animal.name, pos);
});
//esta funcion se ejecuta en el index, lo que hace es quedarse escuchando el topico y
//se conecta al broker
export function connectToBroker() {
  client.on("connect", () => {
    client.subscribe("server", (err) => {
      if (!err) {
      }
    });
  });
}

//funcion para obtener el mapa con posiciones
export function getPosiciones() {
  return posiciones;
}
//imagino que el mensaje que se envia es para el topico "server" y
//viene en forma de json tipo {animal:nombre, X:X,Y:Y}
//y en base a esto guardarlo en algun archivo asi se puede leer la posicion real si
//se consultara a la api tipo GET .../posicion para pensar
client.on("message", (topic, message) => {
  // message is Buffer
  if (topic === "server") {
    console.log(message.toString());
    actualizarPosicion(message.toString());
    console.log(posiciones);
    //client.end();
  }
});

//si llega un mensaje con un animal y su posicion, se actualiza en el mapa
function actualizarPosicion(mensaje) {
  mensaje = JSON.parse(mensaje);
  if (posiciones.has(mensaje.name)) {
    const pos = [mensaje.x, mensaje.y];
    posiciones.set(mensaje.name, pos);
  } else {
  }
}
