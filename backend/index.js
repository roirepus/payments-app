import e from "express" 
import cors from "cors"
import router from "./routes/index.js";

const app= e()
const PORT=3000

//middlewares
app.use(e.json())
app.use(cors())
app.use(router)

app.get("/",(req,res)=>{
	res.json("hemlo")
})
app.listen(PORT,()=>{
	console.log(`app running on port ${PORT}`)
})


