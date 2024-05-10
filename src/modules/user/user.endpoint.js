import { roles } from "../../middleware/auth.js";

export const endPoint={
get:Object.values(roles)
}