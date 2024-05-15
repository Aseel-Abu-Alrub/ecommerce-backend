// import fileupload2, { fileValidation2 } from '../../services/multer.js';
import * as SubcategoriesController from './subcategory.controller.js'
import productRouter from '../products/products.router.js'
import { Router } from "express";
const router=Router({mergeParams:true})

router.use('/:id/product',productRouter)
router.post('/',SubcategoriesController.createSubCategory)
router.get('/',SubcategoriesController.getSubCategory)


export default router  