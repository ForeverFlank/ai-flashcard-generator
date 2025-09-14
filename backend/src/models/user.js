import mongoose from "mongoose";
import { hashPassword } from "../password";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    salt: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = hashPassword(this.password, this.salt);
    next();
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    return this.password === hashPassword(candidatePassword, this.salt);
};

const User = mongoose.model("User", UserSchema);
export { User }