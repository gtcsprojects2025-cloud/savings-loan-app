// upload.js
const multer = require('multer');

const storage = multer.diskStorage(); // or use diskStorage if saving to filesystem
const upload = multer({ storage });



module.exports = upload;
