
import { Router } from "express";
import * as couponController from './coupon.controller.js'
import { auth } from "../../middleware/auth.js";
const router=Router()

router.post('/',couponController.createCoupon)
router.get('/',auth(),couponController.getCoupon)
router.put('/:id',couponController.updateCoupon)
router.patch('/softdelete/:id',couponController.softDelete)
router.delete('/harddelete/:id',couponController.hardDelete)
router.patch('/restore/:id',couponController.restore)



export default router