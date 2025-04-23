import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    donationID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Donation'
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    charityID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


requestSchema.post("save", async function () {
    await this.populate("donationID", "category foodItems description image")
        .populate("userID", "name phone city role address");
})

const requestModel = mongoose.model("Request", requestSchema);

export default requestModel;