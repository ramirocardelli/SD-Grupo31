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
        event.target.reset(); // Limpiar el formulario
      } else {
        alert("Error al registrar el animal: " + response.statusText);
      }
    } catch (error) {
      console.error("Error al dar de alta el animal:", error);
      alert("Ocurrió un error al registrar el animal.");
    }
  }

  //SEND BAJA a la API (DELETE)
  async bajaAnimal(event) {
    try {
      event.preventDefault();

      const animalId = event.target.elements.animalIdBaja.value.trim();
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
        event.target.reset();
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
        event.target.reset(); // Limpiar el formulario
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

  async listarAnimals(){
    const accessToken = AuthStateHelper.getAccessToken();

    const response = await AnimalAPIHelper.handleAnimal(
      "getAnimals",
      accessToken
    );

    const listado=document.getElementById("listado");
    listado.querySelectorAll('li').forEach((li)=>{
      li.remove()
    })
    response.data.forEach(element => {
        const li = document.createElement('li');
        const li_id = document.createElement('div');
        li_id.textContent=element.id
        const li_name = document.createElement('div');
        li_name.textContent=element.name
        const li_desc = document.createElement('div');
        li_desc.textContent=element.description
        li.appendChild(li_id)
        li.appendChild(li_name)
        li.appendChild(li_desc)
        listado.appendChild(li);
    });


  }


  //Manejo de las acciones
  handleSubmit = async (event) => {
    console.log("Entre al handler del submit");
    event.preventDefault();
    const action = event.submitter.id;

    switch (action) {
      case "alta":
        this.altaAnimal(event);
        break;
      case "baja":
        this.bajaAnimal(event);
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
      default:
        console.error("Acción desconocida");
    }
  };

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
            <div id="alta" class="form-panel-animal" style="display: none;">
                <h2>Registrar animal</h2>
                <form class="login-form-animal">

                    <label for="identificador">Número de identificador de collar:</label>
                    <input type="text" id="animalIdAlta" name="animalIdAlta" required>

                    <label for="nombre">Nombre del animal:</label>
                    <input type="text" id="animalNameAlta" name="animalNameAlta" required>

                    <label for="nombre">Descripcion:</label>
                    <input type="text" id="animalDescriptionAlta" name="animalDescriptionAlta" required>

                    <div class="button-container-animal">
                        <button type="submit" id="alta">Registrar</button>
                    </div>

                </form>
            </div>

            <!-- baja -->
            <div id="baja" class="form-panel-animal" style="display: none;">
                <form class="login-form-animal">
                    <h2>Eliminar animal</h2>

                    <label for="baja-identificador">Número de identificador del collar:</label>
                    <input type="text" id="animalIdBaja" name="animalIdBaja" required>

                    <div class="button-container-animal">
                        <button type="submit" id="baja">Eliminar</button>
                    </div>

                </form>
            </div>

            <!-- listar -->
            <div id="Listar" class="form-panel-animal" style="display: none;">
            <form class="login-form-animal">  
              <ul id="listado" class="listado">
              </ul>
              <div class="button-container-animal">
                <button type="submit" id="listar">Listar</button>
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
                    <button type="submit" id="modif">Modificar</button>
                    </div>
                </form>
            </div>

            <!-- Mostrar animales TODO MAPA -->
            <div id="mostrar" class="form-panel-animal map-panel-animals" style="display: none;">
                <h2>Mostrar animales en el Mapa</h2>
                    <div class="button-container">
                        <form>
                        <button type="submit" id="mostrar">Cargar mapa</button>
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
