import multer from "multer";
import path from "path";

// Dosyaların nereye ve nasıl kaydedileceğini ayarlıyoruz
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // uploads klasörüne kaydedilecek
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // dosya ismini eşsiz yap
  }
});

// Sadece resim yüklemeye izin verelim
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Sadece resim yüklenebilir!"), false);
  }
};

export const upload = multer({ storage, fileFilter });
