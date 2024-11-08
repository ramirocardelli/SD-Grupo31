export default class AnimalAPIHelper {
  static async handleAnimal(action, animalData, accessToken, refreshToken) {
    console.log("ACCESS");
    console.log(accessToken);
    console.log(refreshToken);
    try {
      //Configuracion header
      const headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };

      //Configuracion url - se modifica segun lo establecido con la catedra
      const url = "http://localhost:3000/API/animals";

      let response;
      switch (action) {
        case "post": {
          response = await axios.post(url, animalData, { headers });
          break;
        }
        case "delete": {
          response = await axios.delete(`${url}/${animalData.id}`, { headers });
          break;
        }
        case "patch": {
          response = await axios.patch(`${url}/${animalData.id}`, animalData, {
            headers,
          }); //se esta mandando el id en el body, chequear si causa problemas
          break;
        }
        case "get": {
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
          throw new Error("Acción no válida");
      }

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        ok: true, // Indica que la solicitud fue exitosa
      };
    } catch (error) {
      if (error.response.status === 401) {
        // if jwt expired, refresh it
        console.log("Token expirado, refrescando token...");
        console.log(accessToken);
        console.log(refreshToken);

        const headers = {
          Authorization: `Bearer ${refreshToken}`,
          "Content-Type": "application/json",
        };

        console.log(headers);

        const refreshResponse = await axios.post(
          "http://localhost:3000/API/refresh",
          {},
          { headers }
        );

        console.log("Refresh response:", refreshResponse);
        if (refreshResponse.status === 200) {
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);
          return this.handleAnimal(
            action,
            animalData,
            refreshResponse.data.accessToken,
            refreshToken
          );
        }
      }

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
