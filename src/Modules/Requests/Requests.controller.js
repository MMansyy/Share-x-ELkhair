import donationModel from "../../../DB/Models/donation.model.js";
import requestModel from "../../../DB/Models/request.model";
import { AppError, asyncHandler } from "../../../utils/GlobalError.js";

// export const createRequest = asyncHandler(async (req, res, next) => {
//     const { donationID } = req.body;
//     const charityID = req.user.id;


//     const isRequested = await requestModel.findOne({ donationID, charityID });
//     if (isRequested) {
//         return next(new AppError("You have already requested this donation", 400));
//     }
//     const donation = await donationModel.findById(donationID);
//     if (!donation) {
//         return next(new AppError("Donation not found", 404));
//     }
//     if (donation.donationStatus !== "available") {
//         return next(new AppError("This donation is no longer available", 400));
//     }
//     const request = await requestModel.create({ donationID, charityID, userID: donation.userID });
//     if (!request) {
//         return next(new AppError("Request not created", 400));
//     }
//     return res.status(201).json({ success: true, data: request });
// })


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

    request = await request.populate("donationID", "category foodItems description image");
    request = await request.populate("userID", "name phone city role address");

    return res.status(201).json({ success: true, data: request });
});


export const getChairtyRequest = asyncHandler(async (req, res, next) => {
    const charityID = req.user.id;
    const requests = await requestModel.find({ charityID }).populate("donationID", "category foodItems donationStatus description image").populate("userID", "name phone city role address");
    if (!requests) {
        return next(new AppError("No requests found", 404));
    }
    return res.status(200).json({ success: true, data: requests });
})

export const getDonorRequest = asyncHandler(async (req, res, next) => {
    const userID = req.user.id;
    const requests = await requestModel.find({ userID }).populate("donationID", "category foodItems donationStatus description image").populate("charityID", "name phone city role address");
    if (!requests) {
        return next(new AppError("No requests found", 404));
    }
    return res.status(200).json({ success: true, data: requests });
})


export const updateRequest = asyncHandler(async (req, res, next) => {
    const { requestID, requestStatus } = req.body;
    const request = await requestModel.findByIdAndUpdate(requestID, { requestStatus }, { new: true });
    if (!request) {
        return next(new AppError("Request not found", 404));
    }
    return res.status(200).json({ success: true, data: request });
})


export const deleteRequest = asyncHandler(async (req, res, next) => {
    const { requestID } = req.body;
    const request = await requestModel.findByIdAndDelete(requestID);
    if (!request) {
        return next(new AppError("Request not found", 404));
    }
    return res.status(200).json({ success: true, data: {} });
})


