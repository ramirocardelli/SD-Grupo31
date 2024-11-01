export const validateLogin = ({ id, password }) => {
    if (!id || !password) {
        alert('Ambos campos son requeridos.');
        return;
    }
}