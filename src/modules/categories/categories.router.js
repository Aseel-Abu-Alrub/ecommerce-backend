import * as categoriesController from './categories.controller.js'
import { Router } from "express";
const router=Router()

router.get('/',categoriesController.categories)


export default router