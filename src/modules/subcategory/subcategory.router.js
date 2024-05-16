// import fileupload2, { fileValidation2 } from '../../services/multer.js';
import * as SubcategoriesController from './subcategory.controller.js'
import { Router } from "express";
const router=Router({mergeParams:true})

router.post('/',SubcategoriesController.createSubCategory)
router.get('/',SubcategoriesController.getSubCategory)
router.get('/:id',SubcategoriesController.getSpesificSubCategory)



export default router  