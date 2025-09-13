import { generateToken } from "../auth.js";
import { User } from "../models/user.js";

async function userRegister(req, res) {
    try {
        const { name, password } = req.body;
        const user = await User.create({ name, password });
        res.status(201).json({ userId: user._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function userLogin(req, res) {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(
        user._id,
        Date.now(),
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    res.json({ token });
}

export { userRegister, userLogin }