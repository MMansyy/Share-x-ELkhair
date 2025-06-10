import donationModel from "../../../DB/Models/donation.model.js";
import requestModel from "../../../DB/Models/request.model.js";
import { AppError, asyncHandler } from "../../../utils/GlobalError.js";
import { createNotification } from "../Notfication/Notfication.controller.js";




export const createRequest = asyncHandler(async (req, res, next) => {
    const { donationID } = req.body;
    const charityID = req.user.id;
    const [isRequested, donation] = await Promise.all([
        requestModel.findOne({ donationID, charityID }),
        donationModel.findById(donationID).populate("userID", "role")
    ]);

    if (isRequested) {
        return next(new AppError("You have already requested this donation", 400));
    }
    if (!donation) {
        return next(new AppError("Donation not found", 404));
    }
    if (donation.donationStatus !== "available") {
        return next(new AppError("This donation is no longer available", 400));
    }
    let request = await requestModel.create({
        donationID,
        charityID,
        userID: donation.userID
    });
    await createNotification(
        charityID,
        donation.userID._id,
        "request",
        request._id
    );
    return res.status(201).json({ success: true, data: request });
});

export async function getAllRequests(req, res, next) {
    const status = req.query.status;
    const requests = await requestModel.find(status ? { status } : {});
    if (!requests) {
        return next(new AppError("No requests found", 404));
    }
    return res.status(200).json({ success: true, data: requests });
}


export const getUserRequests = asyncHandler(async (req, res, next) => {
    const { id, role } = req.user;
    const filter = {};
    if (role === "donor" || role === "restaurant") {
        filter.userID = id;
    } else if (role === "charity") {
        filter.charityID = id;
    } else if (role === "admin") {
    }
    else {
        return next(new AppError("Unauthorized role", 403));
    }
    if (req.query.status) {
        filter.status = req.query.status;
    }
    const populateUserField = (role === "charity") ? "userID" : "charityID";
    const requests = await requestModel
        .find(filter)
        .populate("donationID", "category foodItems donationStatus description image")
        .populate(populateUserField, "name phone city role address")
        .sort({ createdAt: -1 });
    if (!requests || requests.length === 0) {
        return next(new AppError("No requests found", 404));
    }
    return res.status(200).json({
        success: true,
        data: requests
    });
});


export const updateRequest = asyncHandler(async (req, res, next) => {
    const { requestID, requestStatus, deliveryStatus } = req.body;
    const request = await requestModel.findById(requestID);
    if (!request) {
        return next(new AppError("Request not found", 404));
    }
    const donation = await donationModel.findById(request.donationID);
    if (!donation) {
        return next(new AppError("Donation not found", 404));
    }
    if (requestStatus && deliveryStatus) {
        return next(new AppError("You can only update one status at a time", 400));
    }
    if (!requestStatus && deliveryStatus) {
        request.deliveryStatus = deliveryStatus;
        await request.save();
        donation.donationStatus = "picked";
        await donation.save();
        await createNotification(
            request.userID._id,
            request.charityID,
            "deliverd",
            request._id
        );
        await createNotification(
            request.charityID,
            request.userID._id,
            "deliverd",
            request._id
        );
        return res.status(200).json({ success: true, data: request });
    }
    const isOwner = request.userID._id.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        return next(new AppError("You are not authorized to update this request", 403));
    }
    request.status = requestStatus;
    await request.save();
    if (requestStatus === "accepted") {
        donation.donationStatus = "reserved";
        await donation.save();
        const pendingRequests = await requestModel.find({
            donationID: request.donationID,
            status: "pending"
        });
        await requestModel.updateMany(
            { donationID: request.donationID, status: "pending" },
            { status: "rejected" }
        );
        if (pendingRequests.length > 0) {
            await Promise.all(
                pendingRequests.map((pendingReq) =>
                    createNotification(
                        pendingReq.userID._id,
                        pendingReq.charityID,
                        "rejected",
                        pendingReq._id
                    )
                )
            );
        }
        await createNotification(
            request.userID._id,
            request.charityID,
            "accepted",
            request._id
        );
    } else if (requestStatus === "rejected") {
        await createNotification(
            request.userID._id,
            request.charityID,
            "rejected",
            request._id
        );
    } else {
        return next(new AppError("Invalid request status", 400));
    }
    return res.status(200).json({ success: true, data: request });
});



export const deleteRequest = asyncHandler(async (req, res, next) => {
    const { requestID } = req.body;
    const request = await requestModel.findById(requestID);
    if (!request) {
        return next(new AppError("Request not found", 404));
    }
    if (request.charityID._id.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new AppError("You are not authorized to delete this request", 403));
    }
    const deleteNotifications = await requestModel.deleteMany({ donationID: request.donationID._id });
    if (deleteNotifications.deletedCount === 0) {
        return next(new AppError("No notifications found to delete", 404));
    }
    await requestModel.findByIdAndDelete(requestID);
    return res.status(200).json({ success: true, data: {} });
});



