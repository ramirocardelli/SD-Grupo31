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
            AuthStateHelper.setAuth({ accessToken, refreshToken })
            window.location.href = '../pages/index.html'

        /*
            const response = await axios.post('http://localhost:3000/login', { // Enviar solicitud API usando axios
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const { accessToken, refreshToken } = response.data; // extrae tokens de respuesta

        // Almacenar los tokens en el almacenamiento local 
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        alert("Inicio de sesión exitoso");
        window.location.href = '/'; // Redirige al home o cualquier otra ruta 
        */

    } catch (error) {
        alert("Usuario o contraseña incorrectos");
    }
}
