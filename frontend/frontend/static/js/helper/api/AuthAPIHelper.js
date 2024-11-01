export default class AuthAPIHelper {
  static async login({ username, password }) {
    const headers = {
      Authorization: `Basic ${btoa(username + ":" + password)}`,
    };

    const response = await axios.post("http://localhost:3000/login", "", {
      headers,
    }); // username y password en header en formato 64
    console.log("Response: " + response);
    return response.data;
  }
}
