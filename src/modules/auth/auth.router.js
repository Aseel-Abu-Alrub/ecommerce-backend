import { Router } from "express";
import * as AuthController from "./auth.controller.js";
import fileupload2, { fileValidation2 } from "../../services/multer.js";
import { asyncHandler } from "../../services/errorHandling.js";

const router = Router();

router.post("/signup", fileupload2(fileValidation2.image).single("image"), AuthController.signup);
router.post("/signin", asyncHandler(AuthController.signin));
router.get("/confirmEmail/:token", AuthController.confirmEmail);
router.patch("/sendCode", AuthController.sendCode);
router.patch("/forgetPassword", AuthController.forgetPassword);

export default router;
