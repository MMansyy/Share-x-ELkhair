import joi from "joi";
import { Types } from "mongoose";


const donationSchema = joi.object({
    userID: joi.required(),
    category: joi.string().valid('مطبوخ', 'معلب', 'مخبوزات', 'مجمد', 'أخرى').required(),
    foodItems: joi.object({
        name: joi.string().required(),
        quantity: joi.number().required()
    }).required(),
    description: joi.string().required(),
    donationStatus: joi.string().valid('available', 'reserved', 'completed').default('available'),
    image: joi.object({
        url: joi.string(),
        publicId: joi.string().allow(null)
    })
}).required();

export default donationSchema;