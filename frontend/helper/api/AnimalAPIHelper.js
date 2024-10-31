export default class AnimalAPIHelper {
    static async requestAnimal(action, animalData, accessToken) {
        try {
            //Configuracion header
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            //Configuracion url - se modifica segun lo establecido con la catedra
            const url = 'API/animals';

            let response;
            switch (action) {
                case 'post': {
                    response = await axios.post(url, animalData, { headers });
                    break;
                }
                case 'delete': {
                    response = await axios.delete(`${url}/${animalData.id}`, { headers });
                    break;
                }
                case 'patch': {
                    response = await axios.patch(`${url}/${animalData.id}`, animalData, { headers }); //se esta mandando el id en el body, chequear si causa problemas
                    break;
                }
                case 'getAnimals': {
                    response = await axios.get(`${url}/position`, animalData, { headers });
                    break;
                }
                /*
                case 'getOneAnimal': {
                    response = await axios.get(`${url}/${animalData.id}`, animalData, { headers });
                    break;
                }
                */
                default:
                    throw new Error('Acción no válida');
            }

            return response; // Devolver la respuesta de la API
        } catch (error) {
            console.error('Error en la solicitud de animales:', error);
            throw error;
        }
    }
}
