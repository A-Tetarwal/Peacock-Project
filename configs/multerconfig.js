const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// setting up disc storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./public/images/uploads`)
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, name) {
            //The character encoding to use. Decodes buf to a string according to the specified character encoding inencoding. start and end may be passed to decode only a subset of buf.
            const fn = name.toString('hex') + path.extname(file.originalname) // since name is a buffer, toh usko string mein convert krna pdega
            cb(null, fn);
        })
    }
})


// expporting upload variable
const upload = multer({storage: storage});
module.exports = upload;