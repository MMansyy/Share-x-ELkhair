import notificationModel from "../../../DB/Models/notfication.model.js";
import { asyncHandler } from "../../../utils/GlobalError.js";


export const createNotification = async (sender, receiver, type, requestID) => {
    const ALLOWED_TYPES = ['accepted', 'rejected', 'request'];
    if (!sender || !receiver || !type) {
        throw new Error("Missing required notification fields: sender, receiver, or type");
    }
    if (!ALLOWED_TYPES.includes(type)) {
        throw new Error("Invalid notification type");
    }
    const notificationData = { sender, receiver, type };
    if (requestID) {
        notificationData.requestID = requestID;
    }
    const notification = await notificationModel.create(notificationData);
    return notification;
};

export const getNotifications = asyncHandler(async (req, res, next) => {
    const { id } = req.user;
    const notifications = await notificationModel.find({ receiver: id }).sort({ createdAt: -1 });
    if (!notifications) {
        return next(new AppError("No notifications found", 404));
    }
    return res.status(200).json({ success: true, data: notifications });
});


