import bcrypt from "bcrypt";
import validator from "validator";
import { model, Schema } from "mongoose";
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!"],
    },
    registrationNo: {
        type: String,
        required: [true, "Please provide your registration number"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password"],
        minLength: 8,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Password should be same!",
        },
    },
    role: {
        type: String,
        enum: ["student", "security", "admin", "teacher"],
        default: "student",
    },
});
userSchema.pre("save", async function () {
    if (!this.isModified("password"))
        return;
    this.password = await bcrypt.hash(this.password, 12);
    this.set("confirmPassword", undefined);
});
userSchema.methods.verifyPassword = async function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
};
const User = model("User", userSchema);
export default User;
//# sourceMappingURL=user.js.map