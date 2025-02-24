import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getBalance , transferMoney} from "../controllers/account.controller.js";
const route=Router()

route.get("/",(req,res)=>{
	res.send("account route")
})
route.get("/balance",authMiddleware,getBalance);
route.post("/transfer",authMiddleware,transferMoney);

export default route
