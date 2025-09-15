"use strict";

import { generateToken } from "../auth.js";
import { User } from "../models/user-model.js";
import { generateSalt, hashPassword } from "../password.js";

const usernameRegex = /^(?!.*  )[a-zA-Z0-9._](?:[a-zA-Z0-9._ ]{1,28}[a-zA-Z0-9._])?$/;

async function signupUser(req, res) {
    try {
        const { name, password } = req.body;
        if (!usernameRegex.test(name)) {
            return res.status(400).json({ error: "Invalid username" });
        }
        if (password.length === 0) {
            return res.status(400).json({ error: "Invalid password" });
        }
        const salt = generateSalt(16);
        const user = await User.create({ name, salt, password });

        const token = generateToken(
            user._id,
            Date.now(),
            Date.now() + 7 * 24 * 60 * 60 * 1000
        );

        res.status(201).json({ token, id: user._id, name: user.name });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function loginUser(req, res) {
    try {
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

        res.json({ token, id: user._id, name: user.name });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export { signupUser, loginUser }