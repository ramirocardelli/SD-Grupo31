import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
    async getAllUsers() {
        const users = JSON.parse(fs.readFileSync('./db/users.json', 'utf8'));
        return users.map(user => ({ id: user.id, name: user.name, roles: user.roles, password: user.password }));
    }

    async createUser(user) {
        const users = JSON.parse(fs.readFileSync('./db/users.json', 'utf8'));
        const newUser = { id: uuidv4(), ...user };
        users.push(newUser);
        fs.writeFileSync('./db/users.json', JSON.stringify(users, null, 2));
        return newUser;
    }
}

const userRepository = new UserRepository();
export default userRepository