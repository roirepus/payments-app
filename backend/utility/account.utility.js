import prisma from "../prisma/index.js";
export async function getActualBalance(userId){
const account = await prisma.account.findUnique({
		where:{
			userId
		},
		select:{
			balance,
			precision
		}
	})
return (account.balance)/(account.precision)
}
