import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async subirImagen(file: Express.Multer.File, carpeta: string = 'utn-bugs/perfiles'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: carpeta,
          resource_type: 'image',
          transformation: [{ width: 500, height: 500, crop: 'limit' }], // Opcional: optimiza tamaño
        },
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            return reject(new BadRequestException('Error al subir la imagen a Cloudinary'));
          }
          resolve(result.secure_url);
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}