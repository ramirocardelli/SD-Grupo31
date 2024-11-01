export const isNewGameValid = (newGame) => {
    return !(
        !newGame ||
        typeof newGame !== 'object' || 
        !newGame.name ||
        !typeof newGame.name === 'string' ||
        !newGame.description ||
        !typeof newGame.description === 'string' ||
        !newGame.photoUrl ||
        !typeof newGame.photoUrl === 'string'
    );
}