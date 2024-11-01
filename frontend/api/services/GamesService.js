import gamesRepository from "../repositories/GamesRepository.js";

class GamesService {
    gamesRepository = gamesRepository;

    async getAllGames() {
        return await this.gamesRepository.getAllGames();
    }

    async createGame(newGame) {
        return await this.gamesRepository.createGame(newGame);
    }
}

const gamesService = new GamesService();
export default gamesService