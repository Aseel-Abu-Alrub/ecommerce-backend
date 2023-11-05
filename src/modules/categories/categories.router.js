import fileupload2, { fileValidation2 } from '../../services/multer.js';
import * as categoriesController from './categories.controller.js'
import subCategoryRouter from '../../modules/subcategory/subcategory.router.js'
import { Router } from "express";
const router=Router()

router.use('/:id/subcategory',subCategoryRouter)
router.get('/',categoriesController.getAllcategories)
router.post('/',fileupload2(fileValidation2.image).single('image'),categoriesController.createCategories)
router.get('/active',categoriesController.getActiveCategory)
router.get('/:id',categoriesController.getspecificCategories)
router.put('/:id',categoriesController.updateCategories)


export default router