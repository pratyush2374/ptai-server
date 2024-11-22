import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    //Destination and Filename
    destination: function (req, _, cb) {
        cb(null, "./public/temp");
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + "-" + uniqueSuffix + ext); //We can use file.fieldname as well
    },
});

export const upload = multer({
    storage,
});
