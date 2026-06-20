import { Router } from 'express';
import { CategoryController } from '../controller/category.controller';
import { authMiddleware, authorizeDynamic } from '../middleware/auth.middleware';

const router = Router();
const categoryController = new CategoryController();

router.post("/", authMiddleware, authorizeDynamic(), categoryController.createCategory);
router.get("/", authMiddleware, authorizeDynamic(), categoryController.getAllCategories);
router.get("/:id", authMiddleware, authorizeDynamic(), categoryController.getCategoryById);

export default router;
