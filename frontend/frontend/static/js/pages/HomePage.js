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
            <h3 class="home-game-list-title">Hola!</h3>
        `;
    this.container.innerHTML = homeHtml;
  }
}
