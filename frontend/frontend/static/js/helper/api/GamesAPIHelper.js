import { API_ROUTES } from '../../constants/constants.js';

export default class GamesAPIHelper {
    static async getGames() {
        const response = await axios.get(API_ROUTES.GAMES);
        return response.data;
    }

    static async addGame({ name, description, photoUrl }) {
        return await axios.post(API_ROUTES.GAMES, { name, description, photoUrl });
    }
}