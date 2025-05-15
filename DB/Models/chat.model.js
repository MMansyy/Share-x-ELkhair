import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

chatSchema.virtual("lastMessage", {
    ref: "Message",
    localField: "_id",
    foreignField: "chatID",
    options: { sort: { createdAt: -1 }, limit: 1 }
});

chatSchema.pre(/^find/, function (next) {
    this.populate("sender", "-password -__v -createdAt -updatedAt")
        .populate("receiver", "-password -__v -createdAt -updatedAt")
})

const chatModel = mongoose.model("Chat", chatSchema);


export default chatModel;