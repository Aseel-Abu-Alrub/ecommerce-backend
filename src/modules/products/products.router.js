import * as productController from './products.controller.js'
import { Router } from "express";
const router=Router()


router.get('/',productController.products)

export default router