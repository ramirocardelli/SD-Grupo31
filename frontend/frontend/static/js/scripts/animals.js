function showPanelAnimals(panelId) {
  // Oculta todos los paneles
  const panels = document.querySelectorAll(
    ".form-panel-animal, .map-panel-animals"
  ); //tmb ocultar mapa TODO
  panels.forEach((panel) => {
    panel.style.display = "none"; // Oculta el panel
  });

  // Muestra el panel seleccionado

  const selectedPanel = document.getElementById(panelId);
  if (selectedPanel) {
    selectedPanel.style.display = "block";
  }

  // Cambia el estado de los botones
  const buttons = document.querySelectorAll(
    ".sidebar-secundaria-animal button"
  );
  buttons.forEach((button) => {
    if (button.getAttribute("data-panel") === panelId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function actualizarId() {
  var select = document.getElementById("list-mac-addr");
  var input = document.getElementById("animalIdAlta");
  input.value = select.value; // Asigna el valor del select al input
}

//SEND ALTA a la API (POST)
async function sendAltaAnimal(event) {
  try {
    event.preventDefault();

    const animalId = event.target.form.elements.animalIdAlta.value.trim();
    const animalName = event.target.form.elements.animalNameAlta.value.trim();
    const animalDesc =
      event.target.form.elements.animalDescriptionAlta.value.trim();
    const accessToken = AuthStateHelper.getAccessToken();

    const animalData = {
      id: animalId,
      name: animalName,
      description: animalDesc,
    };

    //Manda POST a la API
    const response = await AnimalAPIHelper.createAnimal(
      "post",
      animalData,
      accessToken
    );

    if (response.status === 200) {
      //codigo de exito
      alert("Animal registrado exitosamente.");
      event.target.form.reset(); // Limpiar el formulario
    } else {
      alert("Error al registrar el animal: " + response.statusText);
    }
  } catch (error) {
    console.error("Error al dar de alta el animal:", error);
    alert("Ocurrió un error al registrar el animal.");
  }
}

//SEND BAJA a la API (DELETE)
async function sendBajaAnimal(event) {
  try {
    event.preventDefault();

    const animalId = event.target.form.elements.animalIdBaja.value.trim();
    const accessToken = AuthStateHelper.getAccessToken();

    const animalData = {
      id: animalId,
    };

    //Manda DELETE a la API
    const response = await AnimalAPIHelper.createAnimal(
      "delete",
      animalData,
      accessToken
    );

    if (response.status === 200) {
      //codigo de exito
      alert("Animal eliminado exitosamente.");
      event.target.form.reset();
    } else {
      alert("Error al eliminar el animal: " + response.statusText);
    }
  } catch (error) {
    console.error("Error al eliminar el animal:", error);
    alert("Ocurrió un error al eliminar el animal.");
  }
}

//SEND MODIFY A LA API (PATCH)
async function sendModifAnimal(event) {
  try {
    event.preventDefault();

    const animalId = event.target.form.elements.animalIdModif.value.trim();
    const animalName = event.target.form.elements.animalNameModif.value.trim();
    const animalDesc =
      event.target.form.elements.animalDescriptionModif.value.trim();
    const accessToken = AuthStateHelper.getAccessToken();

    const animalData = {
      id: animalId,
      name: animalName,
      description: animalDesc,
    };

    //Manda PATCH a la API
    const response = await AnimalAPIHelper.createAnimal(
      "patch",
      animalData,
      accessToken
    );

    if (response.status === 200) {
      //codigo de exito
      alert("Animal modificado exitosamente.");
      event.target.form.reset(); // Limpiar el formulario
    } else {
      alert("Error al modificar el animal: " + response.statusText);
    }
  } catch (error) {
    console.error("Error al modificar el animal:", error);
    alert("Ocurrió un error al modificar el animal.");
  }
}
