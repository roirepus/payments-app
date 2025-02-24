import bcrypt from "bcrypt"
import prisma from "../prisma/index.js"
import "dotenv/config.js"
import jwt from "jsonwebtoken"
import { signUpSchema, signInSchema, updateUserSchema } from "../schemas/user.schema.js"

const saltRounds = parseInt(process.env.SALT_ROUNDS || "10", 10)
const jwtSecret = process.env.JWT_SECRET || "nottobeused"
const tokenExpiry = process.env.TOKEN_EXPIRT || "24h"
export async function signUp(req, res) {
	const { email, password, firstName, lastName } = req.body

	//validating input data
	const parsedData = signUpSchema.safeParse({ email, password, firstName, lastName })
	if (parsedData.error) {
		return res.status(400).json({
			msg: "validation failed",
			errors: parsedData.error
		})
	}

	try {
		//checking for existing user
		const existingUser = await prisma.user.findUnique({
			where: {
				email
			}
		})
		if (existingUser) {
			return res.status(409).json({ msg: "Email already used" })
		}
		//hash password and create user
		//const hashedPassword = await bcrypt.hash(password, saltRounds);
		let hashedPassword = password;
		try {
			hashedPassword = await bcrypt.hash(password, saltRounds);
		} catch (error) {
			console.error("Failed password hashing: ", error);
			return res.status(500).json({
				msg: "Eror processing password"
			})
		}
		//creating user

		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				firstName,
				lastName,
			}
		})

		const userId = newUser.id;

		//random balance 
		const balance = 1 + Math.random() * 1000000;
		await prisma.account.create({
			data: {
				userId,
				balance,
			}
		})
		//jwt
		try {
			const token = jwt.sign(
				{
					userId: newUser.id,
					email: newUser.email
				},
				jwtSecret,
				{ expiresIn: tokenExpiry }
			); return res.status(201).json({
				msg: "User created successfully",
				token
			})
		} catch (jwtError) {
			console.error("JWT signing failed:", jwtError);
			return res.status(500).json({
				msg: "Error generating authentication token"
			});
		}

	} catch (error) {
		console.error("Signup error: ", error)
		return res.status(500).json({
			msg: "Internal Server error"
		})
	}
}

export async function signIn(req, res) {

	const { email, password } = req.body
	const parsedData = signInSchema.safeParse({ email, password })
	if (parsedData.error) {
		return res.status(411).json({
			msg: "Invalid credentials"
		})
	}



	try {
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		})
		const success = bcrypt.compare(password, user.password)
		if (success) {
			const token = jwt.sign({
				userId: user.id,
				email: user.email,

			}, jwtSecret,
				{ expiresIn: tokenExpiry })

			return res.status(200).json({
				token: token
			})
		}

	} catch (error) {
		console.error("Error while logging in ", error)
		return res.status(411).json({
			msg: "Error while logging in"
		})
	}

}

export async function updateUser(req, res) {
	//get userId from req.body. passed from middleware

	const userId = req.userId
	//get user details from db? better way?
	const user = await prisma.user.findUnique({
		where: {
			id: userId
		}
	})
	//how to update pwd?
	const firstName = req.body.firstName || user.firstName
	const lastName = req.body.lastName || user.lastName
	//	const password=user.password || req.body.firstName
	const email = req.body.email || user.email

	const validatedData = updateUserSchema.safeParse({ firstName, lastName, email })
	if (validatedData.error) {
		console.erro("Error validating user details: ", error)
		return res.status(411).json({
			msg: "Error verifying user details"
		})
	}
	try {
		const updateUser = await prisma.user.update({
			where: {
				id: userId
			},
			data: {
				firstName,
				lastName,
				email,
			}
		})
		return res.status(200).json({
			msg: "User updated successfully"
		})

	} catch (error) {
		console.error("Error updating user details");
		res.status(411).json({
			msg: "Error updating user details"
		})
	}
}

export async function getUsers(req, res) {
	const filter = req.query.filter || ""
	try {
		const users = await prisma.user.findMany({
			where: {
				OR: [
					{
						lastName: {
							contains: filter,
							mode: "insensitive",
						},
					},
					{
						firstName: {
							contains: filter,
							mode: "insensitive",
						}
					},
				]
			},
			select: {
				id: true,
				email: true,
				firstName: true,
				lastName: true,
			}
		})
		res.status(200).json({
			user: users.map(user => ({
				id: user.id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			}))
		})
	} catch (error) {

	}
}

