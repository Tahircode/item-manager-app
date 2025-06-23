import { cloudinary } from '../cloudinary';
import { randomUUID } from 'crypto';

export async function saveFile(file: globalThis.File, folder = 'uploads'): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder,
        public_id: `${randomUUID()}-${file.name}`,
        allowed_formats: ['jpg', 'jpeg', 'png'],
      },
      (err: Error | undefined, result: { secure_url: string } | undefined) => {
        if (err || !result) {
          reject(err || new Error('Upload failed'));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    stream.end(buffer);
  });
}
