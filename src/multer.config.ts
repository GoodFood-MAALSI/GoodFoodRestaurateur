import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs'; 

const uploadPath = './uploads'; 


if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: uploadPath, 
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtName = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, 
  },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return callback(new Error('Seuls les fichiers image (jpg, jpeg, png) sont autorisés!'), false);
    }
    callback(null, true);
  },
};