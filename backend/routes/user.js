import Router from "express"
import { signUp ,signIn, updateUser,getUsers} from "../controllers/auth.contorller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"
const route=Router()

route.get("/",(req,res)=>{
	res.json("users get route")
})
route.post("/signup",signUp)
route.post("/signin",signIn)
route.put("/",authMiddleware,updateUser)
route.get("/bulk",getUsers)

export default route

