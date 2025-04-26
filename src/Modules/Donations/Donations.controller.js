import donationModel from "../../../DB/Models/donation.model.js";
import cloudinary from "../../../utils/cloudinary.js";
import { AppError, asyncHandler } from "../../../utils/GlobalError.js";
import fs from "fs";
import donationSchema from "./Donation.validation.js";


export const getDonations = asyncHandler(async (req, res, next) => {
    const donations = await donationModel.find({ donationStatus: "available" }).populate("userID", "name phone city address profilePicture")
    res.status(200).json({ message: "hello son of hakuna matata", donations });
})

export const getSingleDonation = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const donation = await donationModel.findById(id).populate("userID", "name phone city address");
    if (!donation) {
        return next(new AppError("Donation not found", 404));
    }
    res.status(200).json({ message: "hello son of hakuna matata", donation });
})


export const getMyDonations = asyncHandler(async (req, res, next) => {
    console.log(req.user._id);
    const donations = await donationModel.find({ userID: req.user._id }).populate("userID", "name phone city address profilePicture");
    res.status(200).json({ message: "hello son of hakuna matata", donations });
})


export const createDonation = asyncHandler(async (req, res, next) => {
    req.body.image = { url: "default.jpg", publicId: null }
    if (req.file && req.file.mimetype.startsWith("image")) {
        try {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "donation", format: 'webp', quality: 'auto:low' });
            req.body.image = { url: secure_url, publicId: public_id }
        } catch (err) {
            return next(new AppError(err, 500));
        }
    }
    if (req.file) {
        fs.unlinkSync(req.file.path);
    }
    let data = req.body;
    data.userID = req.user._id
    data.foodItems = { name: data.name, quantity: data.quantity }
    delete data.name;
    delete data.quantity;
    console.log(data.foodItems);
    const valid = donationSchema.validate(data, { abortEarly: false });
    if (valid.error) {
        if (data.image.publicId) {
            await cloudinary.uploader.destroy(data.image.publicId);
        }
        return next(new AppError(valid.error.details.map(err => err.message).join(", "), 400));
    }
    const donation = await donationModel.create(data);
    if (!donation) {
        if (data.image.publicId) {
            await cloudinary.uploader.destroy(data.image.publicId);
        }
        return next(new AppError("Donation not created", 400));
    }
    return res.status(201).json({ message: "hello son of hakuna matataaa", donation });
})



export const updateDonation = asyncHandler(async (req, res, next) => {
    const roles = ["donor", "restaurant", "admin"];
    if (!roles.includes(req.user.role)) {
        return next(new AppError("You are not allowed to update donation", 400));
    }
    const { id } = req.params;
    let data = req.body;
    data.userID = req.user._id
    if (data.name && data.quantity) {
        data.foodItems = { name: data.name, quantity: data.quantity }
        delete data.name;
        delete data.quantity;
    }
    const donation = await donationModel.findById(id);
    if (!donation) {
        return next(new AppError("Donation not found", 404));
    }
    console.log(donation.userID.toString(), req.user._id.toString());

    if (donation.userID.toString() !== req.user._id.toString() && req.user.role !== "admin") {
        return next(new AppError("You are not allowed to update this donation", 400));
    }
    if (req.file && req.file.mimetype.startsWith("image")) {
        try {
            if (donation.image.publicId) {
                await cloudinary.uploader.destroy(donation.image.publicId);
            }
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "donation", format: 'webp', quality: 'auto:low' });
            data.image = { url: secure_url, publicId: public_id }
        } catch (err) {
            return next(new AppError(err.message, 500));
        }
    }
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting temp image:", err);
        });
    }
    const updatedDonation = await donationModel.findByIdAndUpdate(id, data, { new: true });
    if (!updatedDonation) {
        return next(new AppError("Donation not updated", 400));
    }
    return res.status(200).json({ message: "hello son of hakuna matata", updatedDonation });
})


export const deleteDonation = asyncHandler(async (req, res, next) => {
    const roles = ["donor", "restaurant", "admin"];
    if (!roles.includes(req.user.role)) {
        return next(new AppError("You are not allowed to delete donation", 400));
    }
    const { id } = req.params;
    const donation = await donationModel.findById(id);
    if (!donation) {
        return next(new AppError("Donation not found", 404));
    }
    if (donation.userID.toString() != req.user._id.toString() && req.user.role !== "admin") {
        return next(new AppError("You are not allowed to delete this donation", 400));
    }
    if (donation.image?.publicId) {
        await cloudinary.uploader.destroy(donation.image.publicId);
    }
    const deletedDonation = await donationModel.findByIdAndDelete(id);
    if (!deletedDonation) {
        return next(new AppError("Donation not deleted", 400));
    }
    return res.status(200).json({ message: "hello son of hakuna matata its deleted", deletedDonation });
})



