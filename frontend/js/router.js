const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  window.history.pushState({}, "", event.target.href);
  handleLocation();
};

const routes = {
  "/": "/pages/home.html",
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

  /*
  // Cargar dinámicamente los estilos
  const existingStyles = document.querySelectorAll('link[rel="stylesheet"]');
  existingStyles.forEach(style => style.remove()); // Eliminar estilos previos

  // CSS correspondiente
  let cssFile = '';
  if (path === '/') {
    cssFile = 'style.css'; // Cambia por el estilo que desees para la página principal
  } else if (path === '/animal') {
    cssFile = 'animal_style.css';
  } else if (path === '/login') {
    cssFile = 'login_style.css';
  } else if (path === '/checkpoints') {
    cssFile = 'checkpoints_style.css';
  } else if (path === '/about') {
    cssFile = '404_style.css';
  }

  // Cargar el CSS correspondiente
  if (cssFile) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `css/${cssFile}`;
    document.head.appendChild(link);
  }

  */
};

window.onpopstate = handleLocation; // Para manejar el retroceso del historial
window.route = route; // Para que sea accesible en el HTML

handleLocation(); 
