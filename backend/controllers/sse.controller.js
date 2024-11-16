import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT_SSE;
export let clients = [];

const router = express.Router();

router.get('/', (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    'Content-Type', 'text/event-stream',
    'Cache-Control', 'no-cache',
    'Connection', 'keep-alive',
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  clients.push(res);

  req.on('close', () => {
      clients.splice(clients.indexOf(res), 1);
  });
});

export const sendSSE = (data) => {
  clients.forEach((client) => {
      console.log("cliente",data,client)
      client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

export default router;
