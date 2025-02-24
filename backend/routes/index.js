import Router from  "express"
import userRouter from "./user.js"
const route=Router()

route.use("/api/v1/user",userRouter)
route.get("/api/v1",(req,res)=>{
	res.json("router page")
})

export default route
