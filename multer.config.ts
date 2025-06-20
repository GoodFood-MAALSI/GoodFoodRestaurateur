import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs'; // Pour vérifier/créer le dossier

const uploadPath = './uploads/images'; // Chemin où les images seront stockées

// Crée le dossier d'uploads si il n'existe pas
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

export const multerConfig: MulterOptions = {
  storage: diskStorage({
    destination: uploadPath, // Spécifie le dossier de destination
    filename: (req, file, callback) => {
      // Génère un nom de fichier unique pour éviter les conflits
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtName = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${fileExtName}`);
    },
  }),
  // Limites de taille de fichier (ex: 5MB)
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  // Filtre les types de fichiers (accepte seulement les images)
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return callback(new Error('Seuls les fichiers image (jpg, jpeg, png) sont autorisés!'), false);
    }
    callback(null, true);
  },
};