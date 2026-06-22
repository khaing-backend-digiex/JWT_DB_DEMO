import express from 'express';
import { UserController } from '../controller/user.controller';
import { authMiddleware, requirePermission } from '../middleware/auth.middleware';
import { validateBodyMiddleware } from '../middleware/validate.middleware';
import { CreateUserSchema } from '../schema-validate/schema';

import { AppPermission } from '../constant/permission.enum';

const userController = new UserController();
const router = express.Router();

router.post('/', validateBodyMiddleware(CreateUserSchema), userController.createUser);
router.put('/:id', authMiddleware, requirePermission([AppPermission.UPDATE_USER, AppPermission.UPDATE_OWN_PROFILE]), userController.updateUser);
router.get('/', authMiddleware, requirePermission([AppPermission.VIEW_USER]), userController.getUsers);
router.get('/:id', authMiddleware, requirePermission([AppPermission.VIEW_USER]), userController.getUser);
router.delete('/:id', authMiddleware, requirePermission([AppPermission.DELETE_USER]), userController.deleteUser);



export default router;