import prisma from "../prisma/index.js"
import { transferSchema } from "../schemas/account.schema.js";

export async function getBalance(req, res) {
	const userId = req.userId
	try {
		//fetching balance from db
		const account = await prisma.account.findUnique({
			where: {
				userId
			},
			select: {
				balance: true,
				precision: true,
			}
		})
		return res.status(200).json({
			balance: (account.balance) / (account.precision)
		})

	} catch (error) {
		console.error("Error fetching account balance", error);
		return res.status(500).json({
			msg: "Failed to get account balance"
		})
	}
}

export async function transferMoney(req, res) {
	const receiverId = (req.body.to);
	const senderId = req.userId;
	const amount = (parseInt(req.body.amount)) * 100;
	//const validatedData = transferSchema.safeParse({ receiverId, senderId, amount });
	// const sender = await prisma.user.findUnique({
	// 	where:{
	// 		id:senderId,
	// 	},
	// 	select:{
	// 		firstName:true,
	// 		lastName:true,
	// 	}
	// })
	// if (validatedData.error) {
	// 	res.status(400).json({
	// 		msg: "validation failed",
	// 	})
	// }

	try {
		return prisma.$transaction(async (tx) => {
			//decrease from sender

			const senderAccount = await tx.account.update({
				data: {
					balance: {
						decrement: amount,
					}
				},
				where: {
					userId: senderId,
				}
			})
			//verify if sender has enough money
			if ((senderAccount.balance) / (senderAccount.precision) < 0) {
				res.status(400).json({
					msg: `You do not have enough to send ${amount / senderAccount.precision}`,
				})
				throw new Error(`${from} doesn't have enough to send ${amount}`)
				//res.status(400).json({
					//msg: `You do not have enough to send ${amount / senderAccount.precision}`,
				//})
				//throw new Error(`You do not have enough to send ${amount}`)
			}
			//increase receiver balance
			const receiverAccount = await tx.account.update({
				data: {
					balance: {
						increment: amount,
					}
				},
				where: {
					userId: receiverId,
				},
			})
			return res.status(200).json(receiverAccount)
		})
	} catch (error) {
		console.error("Error while processing the transfer");
		res.status(400).json({
			msg: "Error processing the transfer"
		})
	}
}


