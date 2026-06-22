import { Router } from 'express';
import { AuthorController } from '../controller/author.controller';
import { authMiddleware, requirePermission } from '../middleware/auth.middleware';
import { validateBodyMiddleware } from '../middleware/validate.middleware';
import { CreateAuthorSchema } from '../schema-validate/schema';

import { AppPermission } from '../constant/permission.enum';

const router = Router();
const authorController = new AuthorController();

router.post("/", authMiddleware, requirePermission([AppPermission.CREATE_AUTHOR]), validateBodyMiddleware(CreateAuthorSchema), authorController.createAuthor);
router.get("/", authorController.getAllAuthors);
router.get("/:id", authMiddleware, requirePermission([AppPermission.VIEW_AUTHOR]), authorController.getAuthorById);
router.put("/:id", authMiddleware, requirePermission([AppPermission.UPDATE_AUTHOR]), validateBodyMiddleware(CreateAuthorSchema), authorController.updateAuthor);
router.delete("/:id", authMiddleware, requirePermission([AppPermission.DELETE_AUTHOR]), authorController.deleteAuthor);

export default router;
