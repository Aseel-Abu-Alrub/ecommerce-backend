import { Router } from "express";
import * as userController from "./user.controller.js"
import { asyncHandler } from "../../services/errorHandling.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./user.endpoint.js";
import fileupload2, { fileValidation2 } from "../../services/multer.js";

const router=Router()

router.get('/', auth(endPoint.get),asyncHandler(userController.profile))
router.post('/uploadExcel',auth(endPoint.get),fileupload2(fileValidation2.file).single('file'),asyncHandler(userController.uploadUserExcel))
router.get('/users',asyncHandler(userController.getUser)) 
 
export default router