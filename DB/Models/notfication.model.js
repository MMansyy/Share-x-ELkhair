import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ['accepted', 'rejected', 'request', 'deliverd'],
        required: true
    },
    requestID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Request",
        required: true
    }
}, { timestamps: true });


notificationSchema.pre(/^find/, function (next) {
    this.populate([
        { path: "sender", select: "-password -__v -createdAt -updatedAt -otp" },
        { path: "receiver", select: "-password -__v -createdAt -updatedAt -otp" },
        { path: "requestID", select: "-__v -createdAt -updatedAt" }
    ])
    next();
})


const notificationModel = mongoose.model("Notification", notificationSchema);

export default notificationModel;

