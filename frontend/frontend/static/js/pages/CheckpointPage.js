import CheckpointAPIHelper from "../helper/api/CheckpointAPIHelper.js";
import AuthStateHelper from "../helper/state/AuthStateHelper.js";

export default class CheckpointPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadCheckpoint();
  }

  async loadCheckpoint() {
    this.render();
    this.addListener();
  }

  async altaCheckpoint(event) {
    try {
      event.preventDefault();

      const checkpointId = event.target.elements.checkpointIdAlta.value.trim();
      const checkpointLat = event.target.elements.lat.value.trim();
      const checkpointLong = event.target.elements.long.value.trim();
      const checkpointDesc =
        event.target.elements.checkpointDescAlta.value.trim();
      const accessToken = AuthStateHelper.getAccessToken();

      const checkpointData = {
        id: checkpointId,
        lat: checkpointLat,
        long: checkpointLong,
        description: checkpointDesc,
      };

      //Manda POST a la API
      const response = await CheckpointAPIHelper.handleCheckpoint(
        "post",
        checkpointData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("checkpoint registrado exitosamente.");
        event.target.reset()
      } else {
        alert("Error al registrar el checkpoint: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al dar de alta el checkpoint:", error);
      alert("Ocurrió un error al registrar el checkpoint.");
    }
  }

  //SEND BAJA a la API (DELETE)
  async bajaCheckpoint(checkpointId) {
    try {
      const accessToken = AuthStateHelper.getAccessToken();

      const checkpointData = {
        id: checkpointId,
      };

      //Manda DELETE a la API
      const response = await CheckpointAPIHelper.handleCheckpoint(
        "delete",
        checkpointData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("checkpoint eliminado exitosamente.");
        listarCheckpoints()
      } else {
        alert("Error al eliminar el checkpoint: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el checkpoint:", error);
      alert("Ocurrió un error al eliminar el checkpoint.");
    }
  }

  //SEND MODIFY A LA API (PATCH)
  async modifCheckpoint(event) {
    try {
      event.preventDefault();
      const checkpointId = event.target.elements.checkpointIdModif.value.trim();

      const checkpointLatitud =
        event.target.elements.checkpointLatModif.value.trim();
      const checkpointLongitud =
        event.target.elements.checkpointLongModif.value.trim();
      const checkpointDesc =
        event.target.elements.checkpointDescriptionModif.value.trim();
      const accessToken = AuthStateHelper.getAccessToken();

      const checkpointData = {
        id: checkpointId,
        lat: checkpointLatitud,
        long: checkpointLongitud,
        description: checkpointDesc,
      };
      //Manda PATCH a la API
      const response = await CheckpointAPIHelper.handleCheckpoint(
        "patch",
        checkpointData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("checkpoint modificado exitosamente.");
        listarCheckpoints()
      } else {
        alert("Error al modificar el checkpoint: " + response.statusText);
      }
    } catch (error) {
      alert("Ocurrió un error al modificar el checkpoint.");
    }
  }

  async listarCheckpoints() {
    const accessToken = AuthStateHelper.getAccessToken();

    const response = await CheckpointAPIHelper.handleCheckpoint(
      "get",
      "",
      accessToken
    );

    const listado = document.getElementById("listado");
    listado.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });

    const tr = document.createElement("tr");
    const tr_lat = document.createElement("th");
    tr_lat.textContent = "Latitud";
    const tr_long = document.createElement("th");
    tr_long.textContent = "Longitud";
    const tr_desc = document.createElement("th");
    tr_desc.textContent = "Descripción";
    const tr_eliminar = document.createElement("th");
    const tr_modificar = document.createElement("th");
    tr.appendChild(tr_lat);
    tr.appendChild(tr_long);
    tr.appendChild(tr_desc);
    tr.appendChild(tr_eliminar);
    tr.appendChild(tr_modificar);
    listado.appendChild(tr);

    response.data?.forEach((element) => {
      const tr = document.createElement("tr");
      // Latitud
      const tr_lat = document.createElement("th");
      tr_lat.id = `lat-${element.id}`;
      tr_lat.textContent = element.lat;

      // Longitud
      const tr_long = document.createElement("th");
      tr_long.id = `long-${element.id}`;
      tr_long.textContent = element.long;

      // Descripción
      const tr_desc = document.createElement("th");
      tr_desc.id = `description-${element.id}`;
      tr_desc.textContent = element.description;

      // Botón eliminar
      const tr_eliminar_rh = document.createElement("th");
      const tr_form_eliminar = document.createElement("form");
      const tr_eliminar = document.createElement("button");
      tr_eliminar.type = "submit";
      tr_eliminar.textContent = "Eliminar";
      tr_eliminar.className = "eliminar-checkpoint";
      tr_eliminar.id = element.id;
      tr_form_eliminar.appendChild(tr_eliminar);
      tr_eliminar_rh.appendChild(tr_form_eliminar);

      // Botón modificar
      const tr_modificar_rh = document.createElement("th");
      const tr_form_modificar = document.createElement("form");
      const tr_modificar = document.createElement("button");
      tr_modificar.type = "submit";
      tr_modificar.textContent = "Modificar";
      tr_modificar.className = "modificar-checkpoint";
      tr_modificar.id = element.id;
      tr_form_modificar.appendChild(tr_modificar);
      tr_modificar_rh.appendChild(tr_form_modificar);

      tr.appendChild(tr_lat);
      tr.appendChild(tr_long);
      tr.appendChild(tr_desc);
      tr.appendChild(tr_eliminar_rh);
      tr.appendChild(tr_modificar_rh);
      listado.appendChild(tr);
    });
    showPanelAnimals("listar");
  }

  //Manejo de las acciones
  handleSubmit = async (event) => {
    event.preventDefault();
    const action = event.submitter.className;

    switch (action) {
      case "alta-checkpoint":
        this.altaCheckpoint(event);
        break;
      case "baja-checkpoint":
        const checkpointId =
          event.target.elements.checkpointIdBaja.value.trim();
        this.bajaCheckpoint(checkpointId);
        break;
      case "modif-checkpoint":
        this.modifCheckpoint(event);
        break;
      case "eliminar-checkpoint":
        this.bajaCheckpoint(event.target[0].id);
        break;
      case "modificar-checkpoint":
        this.modificarCheckpointId(event.target[0].id);
        break;
    }
  };

  modificarCheckpointId(id) {
    const checkpointLatitud = document.getElementById(`lat-${id}`).textContent;
    const checkpointLong = document.getElementById(`long-${id}`).textContent;
    const checkpointDescription = document.getElementById(
      `description-${id}`
    ).textContent;
    showPanelCheckpoint("modificacion");
    const inputId = document.getElementById("checkpointIdModif");
    inputId.value = id;

    const inputLat = document.getElementById("checkpointLatModif");
    inputLat.value = checkpointLatitud;

    const inputLong = document.getElementById("checkpointLongModif");
    inputLong.value = checkpointLong;

    const inputDesc = document.getElementById("checkpointDescriptionModif");
    inputDesc.value = checkpointDescription;
  }

  render() {
    const formHtml = `        <div class="sidebar-secundaria">
            <button data-panel="alta" onclick="showPanelCheckpoint('alta')">Agregar punto de control</button>
            <button data-panel="listar" id="list-checkpoints-button" >Listar puntos de control</button>
        </div>

        <div class="page-container-check">
            <!-- alta -->
            <div id="alta" class="alta-checkpoint form-panel-check" style="display: none;">
                <h2>Agregar punto de control</h2>
                <form class="login-form-check">

                    <label for="identificador">Id de punto de control:</label>
                    <input type="text" id="checkpointIdAlta" name="checkpointIdAlta" required>

                    <label for="lat">Coordenadas latitud:</label>
                    <input type="text" id="lat" name="lat" required>
                    
                    <label for="long">Coordenadas longitud:</label>
                    <input type="text" id="long" name="long" required>

                    <label for="checkpointDescAlta">Descripcion:</label>
                    <input type="text" id="checkpointDescAlta" name="checkpointDescAlta" required>

                    <div class="button-container-check">
                        <button type="submit" class="alta-checkpoint">Agregar</button>
                    </div>  

                </form>
            </div>

            <!-- baja -->
            <div id="baja" class="baja-checkpoint form-panel-check" style="display: none;">
                <form class="login-form-check">
                    <h2>Eliminar punto de control</h2>

                    <label for="checkpointIdBaja">Id de punto de control:</label>
                    <input type="text" id="checkpointIdBaja" name="checkpointIdBaja" required>

                    <div class="button-container-check">
                        <button type="submit" class="baja-checkpoint">Eliminar</button>
                    </div>

                </form>
            </div>

            <!-- listar -->
            <div id="listar" class="listar-checkpoint form-panel-check" style="display: none;">
              <table id="listado" class="listado">
              </table>
            <form class="login-form-checkpoint"> 
              <div class="button-container-check">
                <button type="submit" class="listar-checkpoint" id="listar">Listar</button>
              </div>
            </form>   
            </div>

            <!-- modificacion -->
            <div id="modificacion" class="modif-checkpoint form-panel-check" style="display: none;">
                <form class="login-form-check">
                    <h2>Modificar punto de control</h2>

                    <label for="checkpointIdModif">Id de punto de control:</label>
                    <input type="text" id="checkpointIdModif" name="checkpointIdModif" required>

                    <label for="checkpointLatModif">Nueva latitud:</label> <!-- texto ver pasar a coordenadas?-->
                    <input type="text" id="checkpointLatModif" name="checkpointLatModif" required>

                    <label for="checkpointLongModif">Nueva longitud:</label> <!-- texto ver pasar a coordenadas?-->
                    <input type="text" id="checkpointLongModif" name="checkpointLongModif" required>

                    <label for="checkpointDescriptionModif">Nueva descripcion:</label> <!-- texto ver pasar a coordenadas?-->
                    <input type="text" id="checkpointDescriptionModif" name="checkpointDescriptionModif" required>
                    
                    <div class="button-container-check">
                        <button type="submit" class="modif-checkpoint">Modificar</button>
                    </div>
                </form>
            </div>

            
            <!-- Mostrar checkpoints TODO MAPA -->
             <!-- en realidad se muestra en mostrar checkpointes los checkpoints y la ubicacion de cada checkpoint - discutir dps-->
            <div id="mostrar" class="form-panel-check map-panel-checkpoints" style="display: none;">
                <h2>Mostrar puntos de control en el Mapa</h2>
                <div class="button-container">
                    <form>
                        <button id="mostrar" type="submit" class="mostrar-checkpoint">Cargar mapa</button>
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
    this.container.addEventListener("submit", this.handleSubmit);
    document.getElementById("list-checkpoints-button").addEventListener("click",this.listarCheckpoints());
  }
}
