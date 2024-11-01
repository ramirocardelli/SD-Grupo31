export default class GamesStateHelper {
    static getGames() {
        return JSON.parse(sessionStorage.getItem('games'));
    }

    static setGames(games) {
        sessionStorage.setItem('games', JSON.stringify(games));
    }
}