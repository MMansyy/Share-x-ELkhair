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
        enum: ['available', 'reserved', 'completed'],
        default: 'available'
    },
    image: {
        url: { type: String, default: "default.jpg" },
        publicId: { type: String, default: null }
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

donationSchema.post("save", async function () {
    await this.populate("userID", "name phone city address");
});

const donationModel = mongoose.model("Donation", donationSchema);

export default donationModel;
