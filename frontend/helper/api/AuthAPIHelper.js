export default class AuthAPIHelper {
    static async login({ username, password }) {

        const headers = {
            'authorization': `Basic ${btoa(username + ':' + password)}`
        };

        const response = await axios.post('/login', {}, { headers }); // username y password en header en formato 64
        return response.data;
    }
}