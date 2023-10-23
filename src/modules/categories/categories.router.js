import fileupload2, { fileValidation2 } from '../../services/multer.js';
import * as categoriesController from './categories.controller.js'
import { Router } from "express";
const router=Router()

router.get('/',categoriesController.categories)
router.post('/',fileupload2(fileValidation2.image).single('image'),categoriesController.createCategories)


export default router