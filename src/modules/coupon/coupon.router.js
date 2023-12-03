
import { Router } from "express";
import * as couponController from './coupon.controller.js'
import { auth } from "../../middleware/auth.js";
import * as validator from './coupon.validation.js'
import { validation } from "../../middleware/validation.js";
const router=Router()

router.post('/',validation(validator.createCoupon),couponController.createCoupon)
router.get('/',auth(),couponController.getCoupon)
router.put('/:id',couponController.updateCoupon)
router.patch('/softdelete/:id',couponController.softDelete)
router.delete('/harddelete/:id',couponController.hardDelete)
router.patch('/restore/:id',couponController.restore)



export default router