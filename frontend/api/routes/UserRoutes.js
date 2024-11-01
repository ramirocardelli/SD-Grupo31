import { UserController } from '../controllers/UserController.js';
import { authenticate } from '../middleware/AuthMiddleware.js';
import express from 'express';

const app = express();

const userController = new UserController();

app.get('/users', authenticate, userController.getAllUsers);
app.post('/users', userController.createUser);

export default app;