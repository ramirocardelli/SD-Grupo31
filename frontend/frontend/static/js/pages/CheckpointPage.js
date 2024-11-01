export default class CheckpointPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadCheckpoint();
  }

  async loadCheckpoint() {
    this.render();
  }

  render() {
    const formHtml = `        <div class="sidebar-secundaria">
            <button data-panel="alta" onclick="showPanelCheckpoint('alta')">Agregar punto de control</button>
            <button data-panel="baja" onclick="showPanelCheckpoint('baja')">Eliminar punto de control</button>
            <button data-panel="modificacion" onclick="showPanelCheckpoint('modificacion')">Modificar punto de control</button>
            <button data-panel="mostrar" onclick="showPanelCheckpoint('mostrar')">Mostrar puntos de control</button>
        </div>

        <div class="page-container-check">
            <!-- alta -->
            <div id="alta" class="form-panel-check" style="display: none;">
                <h2>Agregar punto de control</h2>
                <form class="login-form-check">

                    <label for="identificador">Id de punto de control (UUID):</label>
                    <input type="text" id="id" name="id" required>

                    <label for="latitud">Coordenadas latitud:</label> <!-- pasar como texto y dps transformar? chequear dps-->
                    <input type="text" id="latitud" name="latitud" required>
                    
                    <label for="altitud">Coordenadas altitud:</label> <!-- pasar como texto y dps transformar? chequear dps-->
                    <input type="text" id="altitud" name="altitud" required>

                    <label for="desc">Descripcion:</label> <!-- pasar como texto y dps transformar? chequear dps-->
                    <input type="text" id="description" name="description" required>

                    <div class="button-container-check">
                        <button type="submit">Agregar</button>
                    </div>  

                </form>
            </div>

            <!-- baja -->
            <div id="baja" class="form-panel-check" style="display: none;">
                <form class="login-form-check">
                    <h2>Eliminar punto de control</h2>

                    <label for="baja-id">Id de punto de control (UUID):</label>
                    <input type="text" id="baja-id" name="baja-id" required>

                    <div class="button-container-check">
                        <button type="submit">Eliminar</button>
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
             <!-- en realidad se muestra en mostrar animales los checkpoints y la ubicacion de cada animal - discutir dps-->
            <div id="mostrar" class="form-panel-check map-panel-checkpoints" style="display: none;">
                <h2>Mostrar puntos de control en el Mapa</h2>
                <div class="button-container">
                    <button type="submit">Cargar mapa</button>
                </div>
                <div id="map" style="height: 400px;"></div>
            </div>
        </div>
    </div>
        `;
    this.container.innerHTML = formHtml;
  }
}
