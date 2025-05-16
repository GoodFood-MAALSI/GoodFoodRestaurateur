import { User } from './src/user/entities/user.entity'; // Ajustez le chemin vers votre entité User

declare global {
  namespace Express {
    interface Request {
      user?: User; // Ou le type de votre objet utilisateur
    }
  }
}