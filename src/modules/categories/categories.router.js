import fileupload2, { fileValidation2 } from '../../services/multer.js';
import * as categoriesController from './categories.controller.js'
import subCategoryRouter from '../../modules/subcategory/subcategory.router.js'
import { Router } from "express";
import { auth } from '../../middleware/auth.js';
import { endPoint } from './category.endpoint.js';
const router=Router()

router.use('/:id/subcategory',subCategoryRouter)
router.get('/',auth(endPoint.getAll),categoriesController.getAllcategories)
router.post('/',auth(endPoint.create),fileupload2(fileValidation2.image).single('image'),categoriesController.createCategories)
router.get('/active',auth(endPoint.getActive),categoriesController.getActiveCategory)
router.get('/:id',auth(endPoint.spicific),categoriesController.getspecificCategories)
router.put('/:id',auth(endPoint.update),categoriesController.updateCategories)


export default router