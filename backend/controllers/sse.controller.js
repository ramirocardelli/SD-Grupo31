import express from "express";
const app = express();
const PORT = 3002;
export let clients = [];

app.get("/API/animals/position", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  clients.push(res);
  console.log("cliente conectado");
  req.on("close", () => {
    console.log("Cliente desconectado.");
    clients = clients.filter((client) => client !== res);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Servidor SSE en ${PORT}`);
});
