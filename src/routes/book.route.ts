import { Router } from 'express';
import { BookController } from '../controller/book.controller';
import { authMiddleware, requirePermission } from '../middleware/auth.middleware';
import { validateBodyMiddleware } from '../middleware/validate.middleware';
import { CreateBookSchema } from '../schema-validate/schema';

import { AppPermission } from '../constant/permission.enum';

const router = Router();
const bookController = new BookController();

router.post("/", authMiddleware, requirePermission([AppPermission.CREATE_BOOK]), validateBodyMiddleware(CreateBookSchema), bookController.createBook);
router.get("/", bookController.getBooks);
router.put("/", authMiddleware, requirePermission([AppPermission.UPDATE_BOOK]), bookController.updateBook);
router.delete("/", authMiddleware, requirePermission([AppPermission.DELETE_BOOK]), bookController.deleteBook);

export default router;
