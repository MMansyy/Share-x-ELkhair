import multer from "multer";


const storage = multer.diskStorage({});
const uploadSingle = multer({ storage }).single('image');

export default uploadSingle;