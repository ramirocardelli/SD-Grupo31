export const validateNewGame = ({ name, description }) => {
    if (!name || !description) {
        alert('Ambos campos son requeridos.');
        return;
    }

    if (name.length < 5 || name.length > 50) {
        alert('El nombre debe tener entre 5 y 50 caracteres.');
        return;
    }

    if (description.length < 5 || description.length > 250) {
        alert('La descripcion debe tener entre 5 y 250 caracteres.');
        return;
    }
}