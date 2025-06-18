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
    }),
    expirationDate: joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).messages({
        'string.pattern.base': 'Expiration date must be in the format YYYY-MM-DD'
    })
}).required();

export default donationSchema;