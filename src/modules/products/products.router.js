import { auth } from '../../middleware/auth.js';
import fileupload2, { fileValidation2 } from '../../services/multer.js';
import { endPoint } from './product.endpoint.js';
import * as productController from './products.controller.js'
import { Router } from "express";
const router=Router()


router.get('/',productController.getproducts)
router.post('/',auth(endPoint.create),fileupload2(fileValidation2.image).fields([
{name:'mainImage',maxCount:1},
{name:'subImages',maxCount:4},


]),productController.createProduct)

export default router