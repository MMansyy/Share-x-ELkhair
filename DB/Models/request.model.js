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
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'delivered'],
        default: 'pending'
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


// requestSchema.post("save", async function () {
//     await this.populate("donationID", "category foodItems description image")
//         .populate("userID", "name phone city role address");
// })

requestSchema.pre(/^find/, function (next) {
    this.populate([
        { path: "donationID", select: "category foodItems description image" },
        { path: "userID", select: "name phone city role address profilePicture" },
        { path: "charityID", select: "name phone city role address profilePicture" }
    ]);
    next();
});


const requestModel = mongoose.model("Request", requestSchema);

export default requestModel;