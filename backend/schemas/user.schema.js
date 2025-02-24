import z from "zod"

export const signUpSchema = z.object({
	email:
		z.string({
			invalid_type_error: "Email must be a string",
			required_error: "Email is required",

		})
			.email({ message: "Invalid email format" })
			.transform((val)=>val.toLowerCase()),
	password:
		z.string({
			required_error: "Password is required",
		})
			.min(4, { message: "Password must be at least 4 characters" })
			.max(20, { message: "Password cannot exceed 20 characters" }),
	firstName:
		z.string({
			invalid_type_error: "First name must be a string",
			required_error: "First name is required"
		}),
	lastName:
		z.string({
			invalid_type_error: "First name must be a string",
			required_error: "First name is required"
		})
})

export const signInSchema = z.object({
	email:
		z
			.string({ required_error: "Email is required" })
			.email({ message: "Invalid Email format" })
			.toLowerCase(),

	password:
		z.string({
			required_error: "Password is Required"
		})
			.min(4, { message: "Password must be at least 4 characters" })
			.max(20, { message: "Password cannot exceed 20 characters" })

})
export const updateUserSchema = z.object({
	// password:
	// 	z.string({
	// 		required_error: "Password is required",
	// 	})
	// 		.min(4, { message: "Password must be at least 4 characters" })
	// 		.max(20, { message: "Password cannot exceed 20 characters" })
	// 		.optional(),
	firstName:
		z.string({
			invalid_type_error: "First name must be a string",
			required_error: "First name is required"
		})
			.optional(),
	lastName:
		z.string({
			invalid_type_error: "First name must be a string",
			required_error: "First name is required"
		})
			.optional(),

	email:
		z.string({
			invalid_type_error: "Email must be a string",
			required_error: "Email is required",

		})
			.email({ message: "Invalid email format" })
			.toLowerCase()
	.optional(),
})
