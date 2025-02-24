
import { z } from "zod";

export const transferSchema= z.object({
	from:z.string(),
	to:z.string(),
	amount:z.number().positive().finite()

})
