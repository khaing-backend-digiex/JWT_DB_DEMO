import express from 'express';
import { UserController } from '../controller/user.controller';
import { authMiddleware, authorizeDynamic } from '../middleware/auth.middleware';


const userController = new UserController();
const router = express.Router();

router.post('/', userController.createUser);
router.put('/:id', authMiddleware, authorizeDynamic(), userController.updateUser);
router.get('/', authMiddleware, authorizeDynamic(), userController.getUsers);
router.get('/:id', authMiddleware, authorizeDynamic(), userController.getUser);
router.delete('/:id', authMiddleware, authorizeDynamic(), userController.deleteUser);



export default router;