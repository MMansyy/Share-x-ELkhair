import userModel from "../../../DB/Models/user.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import fs from "fs";
import { AppError, asyncHandler } from "../../../utils/GlobalError.js";
import bcrypt from "bcrypt";
import sendEmail from "../../../utils/nodemailer.js";
import notificationModel from "../../../DB/Models/notfication.model.js";
import requestModel from "../../../DB/Models/request.model.js";
import donationModel from "../../../DB/Models/donation.model.js";

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
export const getAllUsers = asyncHandler(async (req, res, next) => {
    const isExist = await userModel.find({
        role: { $ne: "admin" }
    }).select("-password -otpCode -__v -createdAt -updatedAt");
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", users: isExist });
})
export const getCharites = asyncHandler(async (req, res, next) => {
    const isExist = await userModel.find({ role: "charity" }).select("-password -otpCode -__v -createdAt -updatedAt");;
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
})
export const getRestaurants = asyncHandler(async (req, res, next) => {
    const isExist = await userModel.find({ role: "restaurant" });
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
export const updateUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const data = req.body;
    const isExist = await userModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
})
export const deleteUser = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const isExist = await userModel.findByIdAndDelete(_id);
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }
    if (isExist.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(isExist.profilePicture.publicId);
    }
    await Promise.all([
        notificationModel.deleteMany({ $or: [{ sender: _id }, { receiver: _id }] }),
        requestModel.deleteMany({ $or: [{ userID: _id }, { charityID: _id }] }),
        donationModel.deleteMany({ $or: [{ userID: _id }, { charityID: _id }] })
    ]);

    res.status(200).json({
        message: "User and related data deleted successfully.",
        user: isExist
    });
});

export const deleteUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const isExist = await userModel.findByIdAndDelete(id);
    if (!isExist) {
        return next(new AppError("User not found", 404));
    }

    res.status(200).json({ message: "hello son of hakuna matata", user: isExist });
})
export const updateProfilePicture = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    console.log("Received File:", req.file);
    const { profilePicture } = req.user;
    if (profilePicture?.publicId) {
        try {
            await cloudinary.uploader.destroy(profilePicture.publicId);
        } catch (err) {
            return next(new AppError(err.message, 500));
        }
    }
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
export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return next(new AppError("Email is required", 400));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    console.log("User found:", user);

    // send otp
    const otpCode = Math.floor(100000 + Math.random() * 900000);
    user.otp = {
        code: otpCode,
        expires: Date.now() + 10 * 60 * 1000, // 10 minutes
        verified: false
    }
    await user.save();
    // send email
    sendEmail(email, "Reset Password", `Your OTP code is ${otpCode}`);
    res.status(200).json({ message: "hello son of hakuna matata", user });
})
export const verifyOtp = asyncHandler(async (req, res, next) => {
    const { email, otpCode } = req.body;
    if (!email || !otpCode) {
        return next(new AppError("Email and OTP code are required", 400));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (user.otp.code !== otpCode) {
        return next(new AppError("OTP code is not correct", 400));
    }
    if (user.otp.expires < Date.now()) {
        return next(new AppError("OTP code has expired", 400));
    }
    user.otp.verified = true;
    await user.save();
    res.status(200).json({ message: "hello son of hakuna matata" });
})
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
        return next(new AppError("Email and new password are required", 400));
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return next(new AppError("User not found", 404));
    }
    if (!user.otp.verified) {
        return next(new AppError("OTP code is not verified", 400));
    }
    user.password = newPassword;
    user.otp = {
        code: null,
        expires: null,
        verified: false
    }
    await user.save();
    res.status(200).json({ message: "Password reseted try to login now!", user });
})





