import { Router } from "express";
import * as cartController from "./cart.controller.js";
import { endPoint } from "../cart/cart.endpoint.js";
import { auth } from "../../middleware/auth.js";
import { asyncHandler } from "../../services/errorHandling.js";
const router = Router();

router.post("/add", auth(endPoint.create), asyncHandler(cartController.createCart));
router.patch("/removeItem", auth(endPoint.delete), cartController.removeItem);
router.patch("/clear", auth(endPoint.clear), cartController.clearCart);
router.get("/", auth(endPoint.get), cartController.getCart);

export default router;
