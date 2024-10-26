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

const cssRoutes = {
  "/": "../css/styles.css",
  404: "../css/404_style.css",
  "/about": "../css/about_style.css",
  "/login": "../css/login_style.css",
  "/animal": "../css/animal_style.css",
  "/checkpoints": "../css/checkpoints_style.css",
};

const handleLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404]; // Usar 404 si no se encuentra la ruta
  const html = await fetch(route).then((data) => data.text());
  document.getElementById("main-page").innerHTML = html;

  // Cargar dinámicamente los estilos
  const existingStyles = document.querySelectorAll('link[rel="stylesheet"]');
  existingStyles.forEach((style) => style.remove()); // Eliminar estilos previos

  //Agregar styles.css a todos (por sidebar fija)
  const mainCss = document.createElement("link");
    mainCss.rel = "stylesheet";
    mainCss.href = "../css/styles.css";
    document.head.appendChild(mainCss)

  // Append a CSS file to the head
  const cssRoute = cssRoutes[path] || cssRoutes[404];
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = cssRoute;
  document.head.appendChild(css);

    // Agregar el script dinámicamente si se carga checkpoints.html
    if (path === "/checkpoints") {
      const script = document.createElement("script");
      script.src = "../js/checkpoints.js"; 
      document.body.appendChild(script);
    }
    if (path === "/animal") {
      const script = document.createElement("script");
      script.src = "../js/animal.js"; 
      document.body.appendChild(script);
    }
    
};

window.onpopstate = handleLocation; // Para manejar el retroceso del historial
window.route = route; // Para que sea accesible en el HTML

handleLocation(); 
