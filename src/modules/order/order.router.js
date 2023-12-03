import {Router} from "express"
import * as orderController from './order.controller.js'
import { auth } from "../../middleware/auth.js"
import { endPoint } from "./order.endpoint.js"

const router=Router()

router.post('/',auth(endPoint.create),orderController.createOrder)

export default router 