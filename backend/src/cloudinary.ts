// src/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export { cloudinary }; // ✅ Add this
export const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: file.fieldname === 'coverImage' ? 'cover-images' : 'additional-images',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  }),
});
