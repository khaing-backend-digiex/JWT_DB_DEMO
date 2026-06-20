import { Router } from "express";
import { AuthenticationController } from "../controller/authentication.controller";

const router = Router();

const authenticationController = new AuthenticationController();

router.post(
    "/",
    authenticationController.register
);

export default router;