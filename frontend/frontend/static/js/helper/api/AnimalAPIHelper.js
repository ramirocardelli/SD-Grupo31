export default class AnimalAPIHelper {
    static async handleAnimal(action, animalData, accessToken) {
        try {
            //Configuracion header
            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            };

            //Configuracion url - se modifica segun lo establecido con la catedra
            const url = 'http://localhost:3000/API/animals';

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
                    response = await axios.get(`${url}`, animalData, { headers });
                    break;
                }
                /*
                case 'getOneAnimal': {
                    response = await axios.get(`${url}/${animalData.id}`, animalData, { headers });
                    return response.data;
                }
                */
                default:
                    throw new Error('Acción no válida');
            }

            console.log('Successful API response:', response);

            return {
                status: response.status,
                statusText: response.statusText,
                data: response.data,
                ok: true // Indica que la solicitud fue exitosa
            };
        } catch (error) {
            console.error('Error en la solicitud de animales:', error);
            return {
                status: error.response?.status || 500,
                statusText: error.response?.statusText || 'Error en la solicitud',
                data: error.response?.data,
                ok: false // Indica que hubo un error
            };
        }
    }
}
