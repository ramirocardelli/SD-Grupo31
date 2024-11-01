import { navigateTo } from "../index.js";
import AuthAPIHelper from "../helper/api/AuthAPIHelper.js";
import { validateLogin } from "../helper/validations/authValidations.js";
import UserStateHelper from "../helper/state/UserStateHelper.js";
import AuthStateHelper from "../helper/state/AuthStateHelper.js";

export default class LoginPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadForm();
  }

  async loadForm() {
    this.render();
    this.addListener();
  }

  async handleSubmit(event) {
    /*try {
            event.preventDefault();
            const id = event.target.elements.id.value.trim();
            const password = event.target.elements.password.value.trim();
            validateLogin({ id, password })
            const userData = await AuthAPIHelper.login({ id, password });
            const { accessToken, refreshToken, ...rest } = userData;
            UserStateHelper.setUser(rest);
            AuthStateHelper.setAuth({ accessToken, refreshToken })
            navigateTo('/');
            window.removeEventListener('submit', this.handleSubmit)
        } catch (e) {
            alert('Usuario o contraseña incorrectos');
        }*/
    console.log("Iniciando proceso de inicio de sesión...");
    try {
      event.preventDefault();
      const username = event.target.elements.username.value.trim();
      const password = event.target.elements.password.value.trim();

      console.log("Datos enviados:", { username, password });

      const userData = await AuthAPIHelper.login({ username, password }); //enviar solicitud a la API - retorna tokens
      //debug
      console.log("Datos de usuario:", userData);

      const { accessToken, refreshToken, ...rest } = userData;
      UserStateHelper.setUser(rest);
      AuthStateHelper.setAuth({ accessToken, refreshToken }); //almacenar access token
      window.location.href = "../pages/index.html";
    } catch (error) {
      console.log(error);
      // alert("Usuario o contraseña incorrectos");
    }
  }

  addListener() {
    window.addEventListener("submit", this.handleSubmit);
  }

  render() {
    const formHtml = `
            <form id="login-form" class="login-form-container">
                <h2 class="login-form-title">Iniciar sesión</h2>
                <div class="input-container">
                    <label for="username" class="input-label">Username:</label>
                    <input type="text" id="username" name="username" class="input-field" required>
                </div>
                <div class="input-container">
                    <label for="password" class="input-label">Contraseña:</label>
                    <input type="password" id="password" name="password" class="input-field" required>
                </div>
                <button type="submit" form="login-form" class="form-submit-button">Iniciar sesión</button>
            </form>
        `;
    this.container.innerHTML = formHtml;
  }
}
