import AnimalAPIHelper from "../helper/api/AnimalAPIHelper.js";
import AuthStateHelper from "../helper/state/AuthStateHelper.js";

export default class AnimalPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.render();
    this.addListener();
  }

  altaAnimal = async (event) => {
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

      //Manda POST a la API
      const response = await AnimalAPIHelper.handleAnimal(
        "post",
        animalData,
        accessToken
      );

      if (response.ok) {
        //codigo de exito
        alert("Animal registrado exitosamente.");
        event.target.reset();
      } else {
        alert("Error al registrar el animal: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al dar de alta el animal:", error);
      alert("Ocurrió un error al registrar el animal.");
    }
  };

  //SEND BAJA a la API (DELETE)
  bajaAnimal = async (animalId) => {
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

      if (response.ok) {
        //codigo de exito
        alert("Animal eliminado exitosamente.");
        this.renderPanelList();
      } else {
        alert("Error al eliminar el animal: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el animal:", error);
      alert("Ocurrió un error al eliminar el animal.");
    }
  };

  //SEND MODIFY A LA API (PATCH)
  modifAnimal = async (event) => {
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
        this.renderPanelList();
      } else {
        alert("Error al modificar el animal: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al modificar un animal:", error);
      alert("Ocurrió un error al modificar el animal.");
    }
  };

  //TODO
  showAnimals = async () => {
    try {
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
    } catch (e) {}
  };

  listDevices = async () => {
    const accessToken = AuthStateHelper.getAccessToken();

    const response = await AnimalAPIHelper.handleAnimal("get", "", accessToken);
    const listado = document.getElementById("listado");
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

    response.data?.forEach((element) => {
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
      tr_eliminar.className = "eliminar-animal";
      tr_eliminar.id = element.id;
      tr_form_eliminar.appendChild(tr_eliminar);
      tr_eliminar_rh.appendChild(tr_form_eliminar);

      // Botón modificar
      const tr_modificar_rh = document.createElement("th");
      const tr_form_modificar = document.createElement("form");
      const tr_modificar = document.createElement("button");
      tr_modificar.type = "submit";
      tr_modificar.textContent = "Modificar";
      tr_modificar.className = "modificar-animal";
      tr_modificar.id = element.id;
      tr_form_modificar.appendChild(tr_modificar);
      tr_modificar_rh.appendChild(tr_form_modificar);

      tr.appendChild(tr_name);
      tr.appendChild(tr_desc);
      tr.appendChild(tr_eliminar_rh);
      tr.appendChild(tr_modificar_rh);
      listado.appendChild(tr);
    });
  };

  //Manejo de las acciones
  handleSubmit = async (event) => {
    event.preventDefault();
    const action = event.submitter.className;

    switch (action) {
      case "alta-animal":
        this.altaAnimal(event);
        break;
      case "baja-animal":
        const animalId = event.target.elements.animalIdBaja.value.trim();
        this.bajaAnimal(animalId);
        break;
      case "modif-animal":
        this.modifAnimal(event);
        break;
      case "eliminar-animal":
        this.bajaAnimal(event.target[0].id);
        break;
      case "modificar-animal":
        this.modificarAnimalId(event.target[0].id);
        break;
    }
  };

  modificarAnimalId = (id) => {
    const animalName = document.getElementById(`name-${id}`).textContent;
    const animalDescription = document.getElementById(
      `description-${id}`
    ).textContent;
    const animal = { id, animalName, animalDescription };
    this.renderPanelModif(animal);
  };

  highlightButton = (buttonDataPanel) => {
    const buttons = document.querySelectorAll(".sidebar-secundaria button");
    buttons.forEach((button) => {
      if (button.getAttribute("data-panel") === buttonDataPanel) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
  };

  render = () => {
    let homeHtml = `
              <div class="sidebar-secundaria">
                <button data-panel="alta" id="reg-animals-button" onclick="">Registrar animal</button>
                <button data-panel="mostrar" id="show-animals-button">Mostrar animales</button>
                <button data-panel="listar" id="list-animals-button" >Listar animales</button>
              </div>
              <div id="page-container-animal">
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
                    <button type="submit" id="modif" class="modif-animal">Modificar</button>
                    </div>
                </form>
            </div>
        `;
    this.container.innerHTML = homeHtml;
  };

  renderPanelList = () => {
    this.highlightButton("listar");
    const container = document.getElementById("page-container-animal");
    container.innerHTML = `
              <!-- listar -->
              <div id="listar" class="listar-animal form-panel-animal">
                <table id="listado" class="listado">
                </table>
              <form class="login-form-animal">  
              </form>   
              </div>
                  `;
    this.listDevices();
  };

  renderPanelMap = () => {
    this.highlightButton("mostrar");
    const container = document.getElementById("page-container-animal");
    container.innerHTML = `
            <!-- Mostrar animales -->
            <div id="mostrar" class="form-panel-animal map-panel-animals">
              <h2>Mostrar animales en el Mapa</h2>
              <div id="map"></div>
            </div>
                  `;
    this.showAnimals();
  };

  renderPanelAlta = () => {
    this.highlightButton("alta");
    const container = document.getElementById("page-container-animal");
    container.innerHTML = `<div id="alta" class="alta-animal form-panel-animal">
                  <h2>Registrar animal</h2>
                  <form class="login-form-animal">
  
                      <!-- Listar animales disponibles -->
                      <label for="list-mac-addr">Animales disponibles:</label>
                      <select id="list-mac-addr" name="list-mac-addr" onchange="actualizarId()">
                          <option selected="true" disabled="disabled">Collares disponibles</option>
                      </select>
  
                      <label for="identificador">Número de identificador de collar:</label>
                      <input type="text" id="animalIdAlta" name="animalIdAlta" required>
  
                      <label for="nombre">Nombre del animal:</label>
                      <input type="text" id="animalNameAlta" name="animalNameAlta" required>
  
                      <label for="nombre">Descripcion:</label>
                      <input type="text" id="animalDescriptionAlta" name="animalDescriptionAlta" required>
  
                      <div class="button-container-animal">
                          <button type="submit" id="alta" class="alta-animal">Registrar</button>
                      </div>
                  </form>
              </div>`;
    this.listAvailableDevices();
  };

  renderPanelModif = (animal) => {
    const container = document.getElementById("page-container-animal");
    container.innerHTML = `
            <!-- modificacion -->
            <div id="modificacion" class="form-panel-animal">
                <form class="login-form-animal">
                    <h2>Modificar animal</h2>

                    <label for="modificar-id">Id del animal:</label>
                    <input type="text" id="animalIdModif" name="animalIdModif" value="${animal.id}" required>

                    <label for="modificar-name">Nuevo nombre del animal:</label>
                    <input type="text" id="animalNameModif" name="animalNameModif" value="${animal.animalName}" required>

                    <label for="nuevo-nombre">Nueva descripcion:</label>
                    <input type="text" id="animalDescriptionModif" name="animalDescriptionModif" value="${animal.animalDescription}" required>

                    <div class="button-container-animal">
                    <button type="submit" id="modif" class="modif-animal">Modificar</button>
                    </div>
                </form>
            </div>`;
  };

  addListener = () => {
    this.container.addEventListener("submit", this.handleSubmit);
    document
      .getElementById("reg-animals-button")
      .addEventListener("click", this.renderPanelAlta);

    document
      .getElementById("show-animals-button")
      .addEventListener("click", this.renderPanelMap);

    document
      .getElementById("list-animals-button")
      .addEventListener("click", this.renderPanelList);
  };

  listAvailableDevices = async () => {
    const accessToken = AuthStateHelper.getAccessToken();
    const response = await AnimalAPIHelper.handleAnimal(
      "getAvailableDevices",
      "",
      accessToken
    );

    const select = document.getElementById("list-mac-addr");
    if (response.ok) {
      response.data?.devices?.forEach((device) => {
        const option = document.createElement("option");
        option.value = device;
        option.textContent = device;
        select.appendChild(option);
      });
    } else {
      alert(
        "Error al listar los dispositivos disponibles: " + response.statusText
      );
    }
  };
}
