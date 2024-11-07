import AnimalAPIHelper from "../helper/api/AnimalAPIHelper.js";
import AuthStateHelper from "../helper/state/AuthStateHelper.js";

export default class AnimalPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimal();
  }

  async loadAnimal() {
    this.render();
    this.addListener();
  }

  async altaAnimal(event) {
    try {
      event.preventDefault();

      const animalId = event.target.elements.animalIdAlta.value.trim();
      const animalName = event.target.elements.animalNameAlta.value.trim();
      const animalDesc =
        event.target.elements.animalDescriptionAlta.value.trim();
      const accessToken = AuthStateHelper.getAccessToken();

      const animalData = {
        id: animalId,
        name: animalName,
        description: animalDesc,
      };

      //debug
      console.log(
        "Data del animal a mandar: " +
          animalData.id +
          animalData.name +
          animalData.description
      );

      //Manda POST a la API
      const response = await AnimalAPIHelper.handleAnimal(
        "post",
        animalData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("Animal registrado exitosamente.");
        window.location.reload();
      } else {
        alert("Error al registrar el animal: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al dar de alta el animal:", error);
      alert("Ocurrió un error al registrar el animal.");
    }
  }

  //SEND BAJA a la API (DELETE)
  async bajaAnimal(animalId) {
    try {
      const accessToken = AuthStateHelper.getAccessToken();

      const animalData = {
        id: animalId,
      };

      //Manda DELETE a la API
      const response = await AnimalAPIHelper.handleAnimal(
        "delete",
        animalData,
        accessToken
      );
      console.log("Response from API:", response);

      if (response.ok) {
        //codigo de exito
        alert("Animal eliminado exitosamente.");
        window.location.reload();
      } else {
        alert("Error al eliminar el animal: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el animal:", error);
      alert("Ocurrió un error al eliminar el animal.");
    }
  }

  //SEND MODIFY A LA API (PATCH)
  async modifAnimal(event) {
    try {
      event.preventDefault();

      const animalId = event.target.elements.animalIdModif.value.trim();
      const animalName = event.target.elements.animalNameModif.value.trim();
      const animalDesc =
        event.target.elements.animalDescriptionModif.value.trim();
      const accessToken = AuthStateHelper.getAccessToken();

      const animalData = {
        id: animalId,
        name: animalName,
        description: animalDesc,
      };

      //Manda PATCH a la API
      const response = await AnimalAPIHelper.handleAnimal(
        "patch",
        animalData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("Animal modificado exitosamente.");
        window.location.reload();
      } else {
        alert("Error al modificar el animal: " + response.statusText);
      }
    } catch (error) {
      alert("Ocurrió un error al modificar el animal.");
    }
  }

  //TODO
  async mostrarAnimals(event) {
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

  async listarAnimals() {
    const accessToken = AuthStateHelper.getAccessToken();

    const response = await AnimalAPIHelper.handleAnimal(
      "getAnimals",
      accessToken
    );

    const listado = document.getElementById("listado");
    listado.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });

    const tr = document.createElement("tr");
    const tr_name = document.createElement("th");
    tr_name.textContent = "Nombre";
    const tr_desc = document.createElement("th");
    tr_desc.textContent = "Descripción";
    const tr_eliminar = document.createElement("th");
    const tr_modificar = document.createElement("th");
    tr.appendChild(tr_name);
    tr.appendChild(tr_desc);
    tr.appendChild(tr_eliminar);
    tr.appendChild(tr_modificar);
    listado.appendChild(tr);

    response.data.forEach((element) => {
      const tr = document.createElement("tr");
      // Nombre
      const tr_name = document.createElement("th");
      tr_name.id = `name-${element.id}`;
      tr_name.textContent = element.name;
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
      tr_eliminar.className = "eliminar";
      tr_eliminar.id = element.id;
      tr_form_eliminar.appendChild(tr_eliminar);
      tr_eliminar_rh.appendChild(tr_form_eliminar);

      // Botón modificar
      const tr_modificar_rh = document.createElement("th");
      const tr_form_modificar = document.createElement("form");
      const tr_modificar = document.createElement("button");
      tr_modificar.type = "submit";
      tr_modificar.textContent = "Modificar";
      tr_modificar.className = "modificar";
      tr_modificar.id = element.id;
      tr_form_modificar.appendChild(tr_modificar);
      tr_modificar_rh.appendChild(tr_form_modificar);

      tr.appendChild(tr_name);
      tr.appendChild(tr_desc);
      tr.appendChild(tr_eliminar_rh);
      tr.appendChild(tr_modificar_rh);
      listado.appendChild(tr);
    });
  }

  //Manejo de las acciones
  handleSubmit = async (event) => {
    console.log("Entre al handler del submit");
    event.preventDefault();
    const action = event.submitter.className;

    switch (action) {
      case "alta":
        this.altaAnimal(event);
        break;
      case "baja":
        const animalId = event.target.elements.animalIdBaja.value.trim();
        this.bajaAnimal(animalId);
        break;
      case "modif":
        this.modifAnimal(event);
        break;
      case "mostrar":
        this.mostrarAnimals(event);
        break;
      case "listar":
        this.listarAnimals();
        break;
      case "eliminar":
        this.bajaAnimal(event.target[0].id);
        break;
      case "modificar":
        this.modificarAnimalId(event.target[0].id);
    }
  };

  modificarAnimalId(id) {
    const animalName = document.getElementById(`name-${id}`).textContent;
    const animalDescription = document.getElementById(
      `description-${id}`
    ).textContent;
    showPanelAnimals("modificacion");
    const inputId = document.getElementById("animalIdModif");
    inputId.value = id;
    const inputName = document.getElementById("animalNameModif");
    inputName.value = animalName;
    const inputDesc = document.getElementById("animalDescriptionModif");
    inputDesc.value = animalDescription;
  }

  render() {
    let homeHtml = `
    
               <div class="sidebar-secundaria-animal">
                    <button data-panel="alta" onclick="showPanelAnimals('alta')">Registrar animal</button>
                    <button data-panel="baja" onclick="showPanelAnimals('baja')">Eliminar animal</button>
                    <button data-panel="modificacion" onclick="showPanelAnimals('modificacion')">Modificar animal</button>
                    <button data-panel="mostrar" onclick="showPanelAnimals('mostrar')">Mostrar animales</button>
                    <button data-panel="Listar" onclick="showPanelAnimals('Listar')">Listar animales</button>
                </div>
                <div class="page-container-animal">
                </div>

            <!-- alta -->
            <div id="alta" class="alta form-panel-animal" style="display: none;">
                <h2>Registrar animal</h2>
                <form class="login-form-animal">

                    <label for="identificador">Número de identificador de collar:</label>
                    <input type="text" id="animalIdAlta" name="animalIdAlta" required>

                    <label for="nombre">Nombre del animal:</label>
                    <input type="text" id="animalNameAlta" name="animalNameAlta" required>

                    <label for="nombre">Descripcion:</label>
                    <input type="text" id="animalDescriptionAlta" name="animalDescriptionAlta" required>

                    <div class="button-container-animal">
                        <button type="submit" id="alta" class="alta">Registrar</button>
                    </div>

                </form>
            </div>

            <!-- baja -->
            <div id="baja" class="baja form-panel-animal" style="display: none;">
                <form class="login-form-animal">
                    <h2>Eliminar animal</h2>

                    <label for="baja-identificador">Número de identificador del collar:</label>
                    <input type="text" id="animalIdBaja" name="animalIdBaja" required>

                    <div class="button-container-animal">
                        <button type="submit" id="baja" class="baja">Eliminar</button>
                    </div>

                </form>
            </div>

            <!-- listar -->
            <div id="Listar" class="listar form-panel-animal" style="display: none;">
              <table id="listado" class="listado">
              </table>
            <form class="login-form-animal">  
              <div class="button-container-animal">
                <button type="submit" class="listar" id="listar">Listar</button>
              </div>
            </form>   
            </div>

            <!-- modificacion -->
            <div id="modificacion" class="form-panel-animal" style="display: none;">
                <form class="login-form-animal">
                    <h2>Modificar animal</h2>

                    <label for="modificar-id">Id del animal:</label>
                    <input type="text" id="animalIdModif" name="animalIdModif" required>

                    <label for="modificar-name">Nuevo nombre del animal:</label>
                    <input type="text" id="animalNameModif" name="animalNameModif" required>

                    <label for="nuevo-nombre">Nueva descripcion:</label>
                    <input type="text" id="animalDescriptionModif" name="animalDescriptionModif" required>

                    <div class="button-container-animal">
                    <button type="submit" id="modif" class="modif">Modificar</button>
                    </div>
                </form>
            </div>

            <!-- Mostrar animales TODO MAPA -->
            <div id="mostrar" class="form-panel-animal map-panel-animals" style="display: none;">
                <h2>Mostrar animales en el Mapa</h2>
                    <div class="button-container">
                        <form>
                        <button type="submit" id="mostrar" class="mostrar">Cargar mapa</button>
                        </form>
                    </div>

                     <div id="map"></div>

                    </div>
                </div>
        `;
    this.container.innerHTML = homeHtml;
  }

  addListener() {
    window.addEventListener("submit", this.handleSubmit);
  }
}
