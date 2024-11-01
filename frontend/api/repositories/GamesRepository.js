import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class GamesRepository {
    async getAllGames() {
        const games = JSON.parse(fs.readFileSync('./db/games.json', 'utf8'));
        return games.map(game => ({ id: game.id, name: game.name, description: game.description, photoUrl: game.photoUrl }));
    }

    async createGame(game) {
        const games = JSON.parse(fs.readFileSync('./db/games.json', 'utf8'));
        const newGame = { id: uuidv4(), ...game };
        games.push(newGame);
        fs.writeFileSync('./db/games.json', JSON.stringify(games, null, 2));
        return newGame;
    }
}

const gamesRepository = new GamesRepository();
export default gamesRepository