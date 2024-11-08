export default class CheckpointsAPIHelper {
  static async handleCheckpoint(action, checkpointData, accessToken) {
    try {
      //Configuracion header
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      //Configuracion url - se modifica segun lo establecido con la catedra
      const url = "http://localhost:3000/API/checkpoints";

      let response;
      switch (action) {
        case "post": {
          response = await axios.post(url, checkpointData, { headers });
          break;
        }
        case "delete": {
          response = await axios.delete(`${url}/${checkpointData.id}`, {
            headers,
          });
          break;
        }
        case "patch": {
          response = await axios.patch(
            `${url}/${checkpointData.id}`,
            checkpointData,
            { headers }
          ); //se esta mandando el id en el body, chequear si causa problemas
          break;
        }
        case "get": {
          response = await axios.get(`${url}`, checkpointData, { headers });
          break;
        }
        /*
                case 'getOne': {
                    response = await axios.get(`${url}/${checkpointData.uuid}`, animalData, { headers });
                    return response.data;
                }
                */
        default:
          throw new Error("Acción no válida");
      }

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        ok: true, // Indica que la solicitud fue exitosa
      };
    } catch (error) {
      console.error("Error en la solicitud de animales:", error);
      return {
        status: error.response?.status || 500,
        statusText: error.response?.statusText || "Error en la solicitud",
        data: error.response?.data,
        ok: false, // Indica que hubo un error
      };
    }
  }
}
