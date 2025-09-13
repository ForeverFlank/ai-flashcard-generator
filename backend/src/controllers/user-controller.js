import { User } from "../models/user.js";

async function userRegister(req, res) {
    try {
        const { email, name, password } = req.body;
        const user = await User.create({ email, name, password });
        res.status(201).json({ userId: user._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

async function userLogin(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({ token });
}

export { userRegister, userLogin }