const userService = require("../services/user.service.js");
const jwtProvider = require("../config/jwtProvider.js");
const bcrypt = require("bcrypt");
const cartService = require("../services/cart.service.js");

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtProvider.generateToken(user.id);

        await cartService.createCart(user.id);

        return res.status(200).send({ jwt, message: "register success" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const login = async (req, res) => {
    const { password, email } = req.body;
    try {
        const user = await userService.getUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found with email: ' + email });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const jwt = jwtProvider.generateToken(user.id);

        return res.status(200).send({ jwt, message: "login success" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const googleAuthCallback = async (req, res) => {
    try {
        const { id: googleId, displayName, emails } = req.user;
        const user = await userService.findOrCreateGoogleUser({ googleId, displayName, email: emails[0].value });
        const jwt = jwtProvider.generateToken(user.id);
        return res.status(200).send({ jwt, message: "Google authentication successful" });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

module.exports = { register, login, googleAuthCallback };