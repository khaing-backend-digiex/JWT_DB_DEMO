import { Router } from 'express';
import { CategoryController } from '../controller/category.controller';
import { authMiddleware, requirePermission } from '../middleware/auth.middleware';
import { validateBodyMiddleware } from '../middleware/validate.middleware';
import { CreateCategorySchema } from '../schema-validate/schema';

import { AppPermission } from '../constant/permission.enum';

const router = Router();
const categoryController = new CategoryController();

router.post("/", authMiddleware, requirePermission([AppPermission.CREATE_CATEGORY]), validateBodyMiddleware(CreateCategorySchema), categoryController.createCategory);
router.get("/", authMiddleware, requirePermission([AppPermission.VIEW_CATEGORY]), categoryController.getAllCategories);
router.get("/:id", authMiddleware, requirePermission([AppPermission.VIEW_CATEGORY]), categoryController.getCategoryById);

export default router;
