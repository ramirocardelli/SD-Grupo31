export default class AuthAPIHelper {
    static async login({ id, password }) {
        const response = await axios.post('http://localhost:3000/login', { id, password });
        return response.data;
    }
}