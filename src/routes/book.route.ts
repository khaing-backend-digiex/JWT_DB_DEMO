import { Router } from 'express';
import { BookController } from '../controller/book.controller';
import { authMiddleware, authorizeDynamic } from '../middleware/auth.middleware';

const router = Router();
const bookController = new BookController();

router.post("/", authMiddleware, authorizeDynamic(), bookController.createBook);
router.get("/", bookController.getBooks);
router.put("/", authMiddleware, authorizeDynamic(), bookController.updateBook);
router.delete("/", authMiddleware, authorizeDynamic(), bookController.deleteBook);

export default router;
