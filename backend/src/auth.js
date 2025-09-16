"use strict";

import { User } from "./models/user-model.js";

function generateToken(userId, startTime, expireTime) {
    const payload = {
        userId,
        iat: startTime || Date.now(),
        exp: expireTime || Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    const payloadStr = JSON.stringify(payload);
    const payloadBase64 = Buffer.from(payloadStr).toString("base64");

    return payloadBase64;
}

function verifyToken(token) {
    const tokenBuf = Buffer.from(token, "base64");

    const payloadBase64 = tokenBuf.toString();
    const payloadStr = Buffer.from(payloadBase64, "base64").toString();

    try {
        const payload = JSON.parse(payloadStr);
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

    const token = authHeader.split(" ")[1];
    const tokenData = verifyToken(token);
    if (!tokenData) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await User.findById(tokenData.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
}
async function optionalAuthMiddleware(req, res, next) {
    req.user = null;

    const authHeader = req.headers.authorization;
    if (!authHeader) return next();

    const token = authHeader.split(" ")[1];
    const tokenData = verifyToken(token);
    if (!tokenData) return next();

    try {
        const user = await User.findById(tokenData.userId);
        if (user) req.user = user;
    } catch (err) {
        // swallow errors, leave req.user = null
    }

    next();
}

async function checkAuth(req, res) {
    res.status(200).json({ id: req.user._id, name: req.user.name });
}

export { generateToken, authMiddleware, optionalAuthMiddleware, checkAuth }