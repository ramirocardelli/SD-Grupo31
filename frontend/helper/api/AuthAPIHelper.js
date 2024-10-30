import axios from 'axios';

export default class AuthAPIHelper {
    static async login({ id, password }) {
        const response = await axios.post('API/login', { id, password });
        return response.data;
    }
}