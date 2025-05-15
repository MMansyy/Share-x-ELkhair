import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chatID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


messageSchema.pre(/^find/, function (next) {
    this.populate("sender", "-password -__v -createdAt -updatedAt")
        .populate("chatID", "-__v -createdAt -updatedAt")
    next();
})

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;