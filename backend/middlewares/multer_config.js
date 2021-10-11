// middleware pour gérer les files images et video
const multer = require('multer');

const MIME_TYPE = {
    //mimetype pour image
    'image/jpg': 'jpg',             //OK
    'image/jpeg': 'jpeg',           //OK
    'image/png': 'png',             //OK
    'image/gif': 'gif',             //OK
    // mimetype pour video/audio
    'audio/wav': 'wav',             //OK v
    // 'video/x-flv': 'flv',           //OK 
    'video/mp4': 'mp4',             //OK  v
    'video/quicktime': 'mov',       //OK v
    // 'video/avi': 'avi',             //OK
    // 'video/x-ms-wmv': 'wmv',        //OK
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split('.')[0].split(' ').join('_');
        const extension = MIME_TYPE[file.mimetype];
        const finalname = name + Date.now() + '.' + extension;// donner 1 nom unique
        callback(null, finalname )
    }
})

// valider les mime-type
const fileFilter = (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == 'audio/wav' || file.mimetype == 'video/mp4'|| file.mimetype == 'video/quicktime') {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg, .jpeg, .mp4, .wav, .mov  format allowed!'));
      }
    }


// stocker 1 seul image  la fois
module.exports = multer ({storage: storage, fileFilter: fileFilter}).single("image")

