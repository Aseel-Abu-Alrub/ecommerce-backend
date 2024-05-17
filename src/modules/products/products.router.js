import { auth } from '../../middleware/auth.js';
import fileupload2, { fileValidation2 } from '../../services/multer.js';
import { endPoint } from './product.endpoint.js';
import * as productController from './products.controller.js'
import * as validator from "./product.validation.js" 
import { Router } from "express";
import { validation } from '../../middleware/validation.js';
const router=Router()


router.get('/',productController.getproducts)
router.post('/',auth(endPoint.create),fileupload2(fileValidation2.image).fields([
{name:'mainImage',maxCount:1},
{name:'subImages',maxCount:4},
 
]),productController.createProduct)
router.put('/:id',productController.updateProduct)

router.patch('/:id/rating',productController.updateRating)
router.patch('/:id/decrease',productController.decreaseRating)
export default router