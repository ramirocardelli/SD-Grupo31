import axios from 'axios';

export default class AuthAPIHelper {
    static async login({ username, password }) {

        const response = await axios.post('/API/login', {}, { username, password }); // username y password en header
        return response.data;
    }
}