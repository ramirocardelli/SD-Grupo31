import { GamesController } from '../controllers/GamesController.js';
import { authenticate } from '../middleware/AuthMiddleware.js';
import express from 'express';

const app = express();

const gamesController = new GamesController();

app.get('/games', authenticate, gamesController.getAllGames);
app.post('/games', authenticate, gamesController.createGame);

export default app;