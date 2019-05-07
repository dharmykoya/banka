
import multer from 'multer';

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, 'uploads/');
  },
  filename(req, file, callback) {
    callback(null, new Date().toISOString().replace(/:/g, '-')
    + file.originalname);
  },
});

const fileFilter = async (req, file, callback) => {
  try {
    if (file.mimetype === 'image/jpeg'
        || file.mimetype === 'image/jpg'
        || file.mimetype === 'image/png') {
      callback(null, true);
    } else {
      return await callback(
        { message: 'This image format is not allowed' },
        false
      );
    }
  } catch (err) {
    return err;
  }
  return true;
};
const Upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter,
});

export default Upload;
