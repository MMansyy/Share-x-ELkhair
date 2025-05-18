import userModel from "../../../DB/Models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../../utils/GlobalError.js";
import { AppError } from "../../../utils/GlobalError.js";
import sendEmail from "../../../utils/nodemailer.js";



export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const isExist = await userModel.findOne({ email });
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    console.log(isExist);
    
    const compare = bcrypt.compareSync(password, isExist.password);
    console.log(compare);
    if (!compare) {
        return next(new AppError("Password is not correct", 400));
    }
    const token = jwt.sign(
        { id: isExist._id, name: isExist.name, role: isExist.role },
        process.env.JWT_SECRET
    );
    res.status(200).json({ message: "hello son of hakuna matata", token });
});

export const register = asyncHandler(async (req, res, next) => {
    let { name, email, password, phone, city, address, details, role } = req.body;
    const isExist = await userModel.findOne({ email });
    if (isExist) {
        return next(new AppError("User already exist", 400));
    }
    console.log(req.body.tin);

    if (req.body.tin) {
        details = {
            ...details,
            tin: req.body.tin
        }
    }

    const user = await userModel.create({ name, email, password, phone, role, city, address, details });
    const token = jwt.sign(
        { id: user._id, name: user.name },
        process.env.JWT_SECRET
    );
    await sendEmail(user.email, "Verify your email", "please verify your email", token)
        .then(() => console.log("email sent"))
        .catch(() => console.log("email not sent"));
    res.status(201).json({ message: { status: "done" }, user });
});

export const protectedRoutes = asyncHandler(async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return next(new AppError("Token is required", 400));
    }
    if (!token.startsWith(process.env.JWT_BARRIER)) {
        return next(new AppError("Token barrier is not valid", 400));
    }

    let realToken = token.split('__')[1];
    const decoded = jwt.verify(realToken, process.env.JWT_SECRET);
    if (!decoded) {
        return next(new AppError("Token is not valid", 400));
    }
    const { id } = decoded;
    const isExist = await userModel.findById(id);
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    if (!isExist.emailVerified) {
        return next(new AppError("Email is not verified", 400));
    }
    req.user = isExist;
    console.log("hello from here", realToken);
    next();
});


export const allowTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You are not allowed to access this route", 400));
        }
        next();
    }
}





export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const { id } = jwt.verify(token, 'mansy');
    console.log(id);
    (id);
    const isExist = await userModel.findByIdAndUpdate(id, { emailVerified: true }, { new: true });
    if (!isExist) {
        next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "success", isExist });
})
