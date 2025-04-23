export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export function asyncHandler(fn) {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err))
    }
}

export const globalErrorHandel = (err, req, res, next) => {
    const code = err.statusCode || 500;
    console.log(err.message);
    res.status(code).json({ msg: err.message, code, stack: err.stack })
}
