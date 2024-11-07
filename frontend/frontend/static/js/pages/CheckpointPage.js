export default class CheckpointPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadCheckpoint();
  }

  async loadCheckpoint() {
    this.render();
    this.addListener();
  }

  async altacheckpoint(event) {
    try {
      event.preventDefault();

      const checkpointUUID =
        event.target.elements.checkpointIdAlta.value.trim();
      const checkpointLatitud = event.target.elements.latitud.value.trim();
      const checkpointAltitud = event.target.elements.altitud.value.trim();
      const checkpointDesc =
        event.target.elements.checkpointDescAlta.value.trim();
      const accessToken = AuthStateHelper.getAccessToken();

      const checkpointData = {
        uuid: checkpointUUID,
        latitud: checkpointLatitud,
        altitud: checkpointAltitud,
        desc: checkpointDesc,
      };

      //debug
      console.log(
        "Data del checkpoint a mandar: " +
          checkpointData.uuid +
          checkpointData.latitud +
          checkpointData.altitud +
          checkpointDesc
      );

      //Manda POST a la API
      const response = await checkpointAPIHelper.handlecheckpoint(
        "post",
        checkpointData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("checkpoint registrado exitosamente.");
        event.target.reset(); // Limpiar el formulario
      } else {
        alert("Error al registrar el checkpoint: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al dar de alta el checkpoint:", error);
      alert("Ocurrió un error al registrar el checkpoint.");
    }
  }

  //SEND BAJA a la API (DELETE)
  async bajacheckpoint(event) {
    try {
      event.preventDefault();

      const checkpointUUID =
        event.target.elements.checkpointIdAlta.value.trim();
      const accessToken = AuthStateHelper.getAccessToken();

      const checkpointData = {
        UUID: checkpointUUID,
      };

      //Manda DELETE a la API
      const response = await checkpointAPIHelper.handlecheckpoint(
        "delete",
        checkpointData,
        accessToken
      );
      console.log("Response from API:", response);

      if (response.ok) {
        //codigo de exito
        alert("checkpoint eliminado exitosamente.");
        event.target.reset();
      } else {
        alert("Error al eliminar el checkpoint: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el checkpoint:", error);
      alert("Ocurrió un error al eliminar el checkpoint.");
    }
  }

  //SEND MODIFY A LA API (PATCH)
  async modifcheckpoint(event) {
    try {
      event.preventDefault();

      const checkpointUUID =
        event.target.elements.checkpointIdAlta.value.trim();
      const checkpointLatitud = event.target.elements.latitud.value.trim();
      const checkpointAltitud = event.target.elements.altitud.value.trim();
      const checkpointDesc =
        event.target.elements.checkpointDescAlta.value.trim();
      const accessToken = AuthStateHelper.getAccessToken();

      const checkpointData = {
        uuid: checkpointUUID,
        latitud: checkpointLatitud,
        altitud: checkpointAltitud,
        desc: checkpointDesc,
      };
      //Manda PATCH a la API
      const response = await checkpointAPIHelper.handleCheckpoint(
        "patch",
        checkpointData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("checkpoint modificado exitosamente.");
        event.target.reset(); // Limpiar el formulario
      } else {
        alert("Error al modificar el checkpoint: " + response.statusText);
      }
    } catch (error) {
      alert("Ocurrió un error al modificar el checkpoint.");
    }
  }

  //TODO
  async mostrarcheckpoints(event) {
    event.target.remove();
    const map = L.map("map").setView(
      [-38.01200620443375, -57.581233775103186],
      13
    );

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([-38.01200620443375, -57.581233775103186])
      .addTo(map)
      .bindPopup("A pretty CSS popup.<br> Easily customizable.")
      .openPopup();
  }

  //Manejo de las acciones
  handleSubmit = async (event) => {
    console.log("Entre al handler del submit");
    event.preventDefault();
    const action = event.submitter.id;

    switch (action) {
      case "alta":
        this.altacheckpoint(event);
        break;
      case "baja":
        this.bajacheckpoint(event);
        break;
      case "modif":
        this.modifcheckpoint(event);
        break;
      case "mostrar":
        this.mostrarcheckpoints(event);
        break;
      default:
        console.error("Acción desconocida");
    }
  };

  render() {
    const formHtml = `        <div class="sidebar-secundaria">
            <button data-panel="alta" onclick="showPanelCheckpoint('alta')">Agregar punto de control</button>
            <button data-panel="baja" onclick="showPanelCheckpoint('baja')">Eliminar punto de control</button>
            <button data-panel="modificacion" onclick="showPanelCheckpoint('modificacion')">Modificar punto de control</button>
            <button data-panel="mostrar" onclick="showPanelCheckpoint('mostrar')">Mostrar puntos de control</button>
        </div>

        <div class="page-container-check">
            <!-- alta -->
            <div id="alta" class="alta form-panel-check" style="display: none;">
                <h2>Agregar punto de control</h2>
                <form class="login-form-check">

                    <label for="identificador">Id de punto de control (UUID):</label>
                    <input type="text" id="checkpointIdAlta" name="checkpointIdAlta" required>

                    <label for="latitud">Coordenadas latitud:</label> <!-- pasar como texto y dps transformar? chequear dps-->
                    <input type="text" id="latitud" name="latitud" required>
                    
                    <label for="altitud">Coordenadas altitud:</label> <!-- pasar como texto y dps transformar? chequear dps-->
                    <input type="text" id="altitud" name="altitud" required>

                    <label for="desc">Descripcion:</label> <!-- pasar como texto y dps transformar? chequear dps-->
                    <input type="text" id="checkpointDescAlta" name="checkpointDescAlta" required>

                    <div class="button-container-check">
                        <button type="submit">Agregar</button>
                    </div>  

                </form>
            </div>

            <!-- baja -->
            <div id="baja" class="baja form-panel-check" style="display: none;">
                <form class="login-form-check">
                    <h2>Eliminar punto de control</h2>

                    <label for="baja-id">Id de punto de control (UUID):</label>
                    <input type="text" id="baja-id" name="baja-id" required>

                    <div class="button-container-check">
                        <button type="submit" class="baja">Eliminar</button>
                    </div>

                </form>
            </div>

            <!-- modificacion -->
            <div id="modificacion" class="form-panel-check" style="display: none;">
                <form class="login-form-check">
                    <h2>Modificar punto de control</h2>

                    <label for="modificar-id">Id de punto de control (UUID):</label>
                    <input type="text" id="modificar-id" name="modificar-id" required>

                    <label for="nueva-lat">Nueva latitud:</label> <!-- texto ver pasar a coordenadas?-->
                    <input type="text" id="nueva-lat" name="nueva-lat" required>

                    <label for="nueva-alt">Nueva altitud:</label> <!-- texto ver pasar a coordenadas?-->
                    <input type="text" id="nueva-alt" name="nueva-alt" required>

                    <label for="nueva-desc">Nueva descripcion:</label> <!-- texto ver pasar a coordenadas?-->
                    <input type="text" id="nueva-desc" name="nueva-desc" required>
                    
                    <div class="button-container-check">
                        <button type="submit">Modificar</button>
                    </div>
                </form>
            </div>

            
            <!-- Mostrar checkpoints TODO MAPA -->
             <!-- en realidad se muestra en mostrar checkpointes los checkpoints y la ubicacion de cada checkpoint - discutir dps-->
            <div id="mostrar" class="form-panel-check map-panel-checkpoints" style="display: none;">
                <h2>Mostrar puntos de control en el Mapa</h2>
                <div class="button-container">
                    <form>
                        <button id="mostrar" type="submit" class="mostrar">Cargar mapa</button>
                    </form>
                </div>
                <div id="map" style="height: 400px;"></div>
            </div>
        </div>
    </div>
        `;
    this.container.innerHTML = formHtml;
  }

  addListener() {
    window.addEventListener("submit", this.handleSubmit);
  }
}
