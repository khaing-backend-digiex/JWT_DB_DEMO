import { Router } from 'express';
import { AuthorController } from '../controller/author.controller';
import { authMiddleware, authorizeDynamic } from '../middleware/auth.middleware';

const router = Router();
const authorController = new AuthorController();

router.post("/", authMiddleware, authorizeDynamic(), authorController.createAuthor);
router.get("/", authMiddleware, authorizeDynamic(), authorController.getAllAuthors);
router.get("/:id", authMiddleware, authorizeDynamic(), authorController.getAuthorById);
router.put("/:id", authMiddleware, authorizeDynamic(), authorController.updateAuthor);
router.delete("/:id", authMiddleware, authorizeDynamic(), authorController.deleteAuthor);

export default router;
