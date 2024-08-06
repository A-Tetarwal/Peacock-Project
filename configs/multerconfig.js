const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// setting up disk storage with dynamic destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check the fieldname to decide the folder
        let folder = '';
        if (file.fieldname.startsWith('projectpic_')) {
            folder = './public/images/projects';
        } else if (file.fieldname === 'profilepic') {
            folder = './public/images/uploads';
        } else if (file.fieldname === 'resume') {
            folder = './public/documents';
        } else {
            return cb(new Error('Invalid fieldname'), false);
        }
        cb(null, folder);
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            if (err) {
                return cb(err);
            }
            const fn = name.toString('hex') + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

// exporting upload variable
const upload = multer({ storage: storage });
module.exports = upload;
