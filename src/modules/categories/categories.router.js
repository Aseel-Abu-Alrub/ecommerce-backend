import fileupload2, { fileValidation2 } from '../../services/multer.js';
import * as categoriesController from './categories.controller.js'
import subCategoryRouter from '../../modules/subcategory/subcategory.router.js'
import { Router } from "express";
import { auth, roles } from '../../middleware/auth.js';
import { endPoint } from './category.endpoint.js';
import { validation } from '../../middleware/validation.js';
import * as validator from "./category.validation.js"
const router=Router()

router.use('/:id/subcategory',subCategoryRouter)
router.get('/',auth(Object.values(roles)),categoriesController.getAllcategories)
router.post('/',auth(endPoint.create),fileupload2(fileValidation2.image).single('image'),validation(validator.createCategory),categoriesController.createCategories)
router.get('/active',auth(endPoint.getActive),categoriesController.getActiveCategory)
router.get('/:id',auth(endPoint.spicific),validation(validator.getSpecificCategory),categoriesController.getspecificCategories) 
router.put('/:id',auth(endPoint.update),categoriesController.updateCategories)
  

export default router 