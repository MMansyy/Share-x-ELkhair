import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [30, "Name must be at most 30 characters long"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },
        address: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["donor", "restaurant", "charity", "admin"],
            default: "donor",
            required: true,
        },
        profilePicture: {
            url: { type: String, default: "default.jpg" },
            publicId: { type: String, default: null },
        },
        verificationStatus: {
            type: String,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        descrption: {
            type: String,
            default: "",
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        otpCode: {
            type: String,
            default: null,
        },
    },
    { timestamps: true, toJSON: { virtuals: true } }
);

userSchema.pre('save', async function () {
    this.password = await bcrypt.hash(this.password, 8);
})

const userModel = mongoose.model('User', userSchema);

export default userModel;







