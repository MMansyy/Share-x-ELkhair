import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    category: {
        type: String,
        enum: ['مطبوخ', 'معلب', 'مخبوزات', 'مجمد', 'أخرى'],
        required: [true, "Category is required"]
    },
    foodItems: {
        name: { type: String, required: true }, // مثال: "أرز مطبوخ" أو "علبة تونة"
        quantity: { type: Number, required: true }, // الكمية
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    donationStatus: {
        type: String,
        enum: ['available', 'reserved', 'picked'],
        default: 'available'
    },

    image: {
        url: { type: String, default: "default.jpg" },
        publicId: { type: String, default: null }
    },
    expirationDate: {
        type: String,
        // required: [true, "Expiration date is required"]
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

donationSchema.post("save", async function () {
    await this.populate("userID", "-password -__v -createdAt -updatedAt");
});


donationSchema.pre(/^find/, async function () {
    this.populate("userID");
});

const donationModel = mongoose.model("Donation", donationSchema);

export default donationModel;
