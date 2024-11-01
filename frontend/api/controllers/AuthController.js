import bcrypt from 'bcrypt';
import userService from '../services/UserService.js';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export class AuthController {
    userService = userService

    login = async (req, res) => {
        try {
            const { id, password } = req.body;
            if (!id || !password) {
                return res.status(400).json({ message: "Missing id or password" });
            }
            const users = await this.userService.getAllUsers();
            const user = users.find(user => user.id === id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Incorrect password" });
            }
            const payload = {
                id: user.id,
                name: user.name,
                roles: user.roles
            }
            const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
            const refreshToken = jwt.sign(payload, secret, { expiresIn: '1d' });
            res.send({ accessToken, refreshToken, ...payload });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

    refresh = async (req, res) => {
        try {
            const refreshToken = req?.body?.refreshToken;
            if (!refreshToken) {
                return res.status(401).send('Access Denied. No refresh token provided.');
            }
            const decoded = jwt.verify(refreshToken, secret);
            const accessToken = jwt.sign({ ...decoded }, secret, { expiresIn: '1h' });
            res
            .send({ accessToken, refreshToken });
        } catch (error) {
            return res.status(400).send('Invalid refresh token.');
        }
    }
}