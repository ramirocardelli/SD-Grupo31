export default class AnimalPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimal();
  }

  async loadAnimal() {
    this.render();
  }

  render() {
    let homeHtml = `
    
               <div class="sidebar-secundaria-animal">
            <button data-panel="alta" onclick="showPanelAnimals('alta')">Registrar animal</button>
            <button data-panel="baja" onclick="showPanelAnimals('baja')">Eliminar animal</button>
            <button data-panel="modificacion" onclick="showPanelAnimals('modificacion')">Modificar animal</button>
            <button data-panel="mostrar" onclick="showPanelAnimals('mostrar')">Mostrar animales</button>
        </div>

        <div class="page-container-animal">
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
                        <button type="submit" onclick="sendAltaAnimal(event)">Registrar</button>
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
                        <button type="submit" onclick="sendBajaAnimal(event)">Eliminar</button>
                    </div>

                </form>
            </div>

            <!-- modificacion -->
            <div id = "modificacion" class="form-panel-animal" style="display: none;">
                            <form class="login-form-animal">
                                <h2>Modificar animal</h2>

                                <label for="modificar-id">Id del animal:</label>
                                <input type="text" id="animalIdModif" name="animalIdModif" required>

                                <label for="modificar-name">Nuevo nombre del animal:</label>
                                <input type="text" id="animalNameModif" name="animalNameModif" required>

                                <label for="nuevo-nombre">Nueva descripcion:</label>
                                <input type="text" id="animalDescriptionModif" name="animalDescriptionModif" required>

                                <div class="button-container-animal">
                                    <button type="submit" onclick="sendModifAnimal(event)">Modificar</button>
                    </div>
                </form>
            </div>

            <!-- Mostrar animales TODO MAPA -->
            <div id="mostrar" class="form-panel-animal map-panel-animals" style="display: none;">
                                        <h2>Mostrar animales en el Mapa</h2>
                                        <div class="button-container">
                                            <button type="submit" onclick="sendShowAnimals(event)">Cargar mapa</button>
                </div>
                <div id=" map" style="height: 400px;">
                                        </div>
                                </div>
                    </div>
            </div>
        `;
    this.container.innerHTML = homeHtml;
  }
}
