export default class HomePage {
  constructor(selector) {
    console.log(selector);
    this.container = document.getElementById(selector);
    this.loadHome();
  }

  async loadHome() {
    this.render();
  }

  render() {
    let homeHtml = `
            <h3>Trabajo practico para sistemas distribuidos</h3>
            <h3>Grupo 31</h3>
            <h3>Integrantes:</h3>
            <h3>Trinitario, Bruno. Cardelli, Ramiro. Frasca, Josefina. Olave, Juan.</h3>
        `;
    this.container.innerHTML = homeHtml;
  }
}
