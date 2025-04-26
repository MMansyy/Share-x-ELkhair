import userModel from "../../../DB/Models/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import fs from "fs";
import { AppError, asyncHandler } from "../../../utils/GlobalError.js";
import bcrypt from "bcrypt";

export const getMe = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", user: req.user });
})

export const getUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const isExist = await userModel.findById(id, { password: 0 });
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
})

export const getCharites = asyncHandler(async (req, res, next) => {
    const isExist = await userModel.find({ role: "charity" }, { password: 0 }).select("-password -otpCode -__v -createdAt -updatedAt");;
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
})

export const getRestaurants = asyncHandler(async (req, res, next) => {
    const isExist = await userModel.find({ role: "restaurant" }, { password: 0 });
    if (!isExist) {
        return next(new AppError("Users not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
})

export const updateUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const data = req.body;
    if (data.email) {
        delete data.email;
    }
    if (data.password) {
        return next(new AppError("You can't update password from here", 400));
    }
    const isExist = await userModel.findByIdAndUpdate(_id, data, { new: true, runValidators: true });
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
})

export const updateProfilePicture = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    console.log("Received File:", req.file);
    if (req.file && req.file.mimetype.startsWith("image")) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "profile" });
        const isExist = await userModel.findByIdAndUpdate(_id, { profilePicture: { url: secure_url, publicId: public_id } }, { new: true, runValidators: true });
        try {
            fs.unlinkSync(req.file.path);
            console.log("File deleted successfully");
        } catch (err) {
            console.error("Error deleting file:", err);
        }
        if (!isExist) {
            return next(new AppError("User not found", 404));
        }
        return res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
    }
    return next(new AppError("Image is required", 400));
})

// update password 
export const updatePassword = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;
    if (currentPassword === newPassword) {
        return next(new AppError("New password must be different from current password", 400));
    }
    if (!currentPassword || !newPassword) {
        return next(new AppError("Current password and new password are required", 400));
    }
    const isExist = await userModel.findById(_id);
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    const compare = bcrypt.compareSync(currentPassword, isExist.password);
    if (!compare) {
        return next(new AppError("Password is not correct", 400));
    }
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updatedUser = await userModel.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true, runValidators: true });
    if (!updatedUser) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({ message: "hello son of hakuna matata", user: updatedUser });
})



