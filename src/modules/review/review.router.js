import { Router } from "express";
import * as reviewController from './review.controller.js'
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./review.endpoint.js";
 
const router=Router()
 
router.post('/:productId',auth(endPoint.create),reviewController.createReview)
router.get('/',auth(endPoint.get),reviewController.getReview)
router.patch('/:id',auth(endPoint.update),reviewController.updateRating)
router.get('/all',reviewController.getAllReview)
router.get('/:id',reviewController.getSpesificReview)
router.delete('/:id',auth(endPoint.delete),reviewController.deleteReview)
router.put('/:id',auth(endPoint.update),reviewController.updateReview)


export default router