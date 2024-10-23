const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {
  "/": "/pages/index.html",
  404: "/pages/404.html",
  "/about": "/pages/about.html",
  "/login": "/pages/login.html",
  "/animal": "/pages/animal.html", 
  "/checkpoints": "/pages/checkpoints.html",
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404]; // Usar 404 si no se encuentra la ruta
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;
};

window.onpopstate = handleLocation; // Para manejar el retroceso del historial
window.route = route; // Para que sea accesible en el HTML

handleLocation(); 
