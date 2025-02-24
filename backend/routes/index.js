import Router from  "express"
import userRouter from "./user.js"
import accountRouter from "./account.js"
const route=Router()

route.use("/api/v1/user",userRouter)
route.use("/api/v1/account",accountRouter)
route.get("/api/v1",(req,res)=>{
	res.json("router page")
})

export default route
