// import axios from 'axios';
import AuthAPIHelper from '../helper/api/api/AuthAPIHelper.js';
import UserStateHelper from '../helper/state/UserStateHelper.js';
import AuthStateHelper from '../helper/state/AuthStateHelper.js';

async function handleLogin(event) {
    try {
        event.preventDefault();
        const username = event.target.elements.username.value.trim();
        const password = event.target.elements.password.value.trim();

        const userData = await AuthAPIHelper.login({ username, password }); //enviar solicitud a la API - retorna tokens
            const { accessToken, refreshToken, ...rest } = userData;
            UserStateHelper.setUser(rest);
            AuthStateHelper.setAuth({ accessToken, refreshToken }) //almacenar access token
            window.location.href = '../pages/index.html'
    } catch (error) {
        alert("Usuario o contraseña incorrectos");
    }
}
