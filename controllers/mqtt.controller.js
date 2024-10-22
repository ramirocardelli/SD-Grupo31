import mqtt from "mqtt";
const client = mqtt.connect("mqtt://localhost:1883");

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

//imagino que el mensaje que se envia es para el topico "server" y
//viene en forma de json tipo {animal:nombre, posicion:X,Y}
//y en base a esto guardarlo en algun archivo asi se puede leer la posicion real si
//se consultara a la api tipo GET .../posicion para pensar
client.on("message", (topic, message) => {
  // message is Buffer
  if (topic === "server") {
    console.log(message.toString());
    //client.end();
  }
});
