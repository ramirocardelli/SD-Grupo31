import { isNewGameValid } from '../validations/gamesValidations.js';
import gamesService from '../services/GamesService.js';

export class GamesController {
    gamesService = gamesService;

    getAllGames = async (req, res) => {
        try {
            const games = await this.gamesService.getAllGames();
            res.json(games);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    createGame = async (req, res) => {
        try {
            const newGame = req.body;
            if (!isNewGameValid(newGame)) {
                return res.status(400).json({ message: "Invalid game" });
            }
            const game = await this.gamesService.createGame(newGame);
            res.status(201).json(game);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
}