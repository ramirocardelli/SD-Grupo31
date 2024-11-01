function showPanelCheckpoint(panelId) {
  // Oculta todos los paneles
  const panels = document.querySelectorAll(
    ".form-panel-check, .map-panel-checkpoints"
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
  const buttons = document.querySelectorAll(".sidebar-secundaria button");
  buttons.forEach((button) => {
    if (button.getAttribute("data-panel") === panelId) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}