const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const pathStorage = `${__dirname}/../public`
        callback(null, pathStorage)
    },
    filename: (req, file, callback) => {
        const ext = file.originalname.split(".").pop()
        const filename = `img-${Date.now()}.${ext}`
        callback(null, filename)
    }
});
//creamos el middleware
const fileUpload = multer({ storage })

module.exports = fileUpload