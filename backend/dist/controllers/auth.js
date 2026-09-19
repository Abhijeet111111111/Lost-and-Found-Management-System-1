import jwt from "jsonwebtoken";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error("JWT_SECRET is not configured");
    return secret;
};
const getJWTToken = (id) => {
    const expiresIn = process.env.JWT_EXPIRES_IN ?? "90d";
    return jwt.sign({ id }, getJwtSecret(), {
        expiresIn: expiresIn,
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = getJWTToken(user._id.toString());
    const cookieExpiryDays = Number(process.env.COOKIE_EXP_DATE ?? 90);
    const cookieOptions = {
        expires: new Date(Date.now() + cookieExpiryDays * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };
    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
        status: "success",
        token,
        data: { user },
    });
};
export const signup = catchAsync(async (req, res) => {
    const newUser = await User.create({
        name: req.body.name,
        registrationNo: req.body.registrationNo,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        role: req.body.role,
    });
    createSendToken(newUser, 201, res);
});
export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("Please enter email and password", 400));
    }
    const user = (await User.findOne({ email }).select("+password"));
    if (!user || !(await user.verifyPassword(password, user.password))) {
        return next(new AppError("Invalid email or password", 401));
    }
    createSendToken(user, 200, res);
});
export const logout = (req, res) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(Date.now() + 10_000),
        httpOnly: true,
    });
    res.status(200).json({ status: "success" });
};
export const protect = catchAsync(async (req, res, next) => {
    const authRequest = req;
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    else {
        token = authRequest.cookies?.jwt;
    }
    if (!token) {
        return next(new AppError("Please login to get access!", 401));
    }
    let decoded;
    try {
        const payload = jwt.verify(token, getJwtSecret());
        if (typeof payload === "string" || typeof payload.id !== "string") {
            throw new Error("Invalid token payload");
        }
        decoded = payload;
    }
    catch {
        return next(new AppError("Invalid token. Please login again", 401));
    }
    const freshUser = (await User.findById(decoded.id));
    if (!freshUser) {
        return next(new AppError("User does not exist", 401));
    }
    authRequest.user = freshUser;
    next();
});
export const restrictTo = (...roles) => {
    return (req, res, next) => {
        const authRequest = req;
        if (authRequest.user && roles.includes(authRequest.user.role)) {
            next();
            return;
        }
        next(new AppError("You are not allowed to do this!", 403));
    };
};
//# sourceMappingURL=auth.js.map