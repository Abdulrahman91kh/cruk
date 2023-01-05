import middy from "@middy/core";
import { LoggerMiddleware } from "../../middleware/LoggerMiddleware";
import { response } from "../../middleware/ResponseMiddleware";
import UsersServices from "../../services/UsersServices";
import { LambdaEvent } from "../../types/Lambda.types";


export const insertUser = async (event: LambdaEvent) => {
	const { email } = typeof event.body === "string" 
		? JSON.parse(event.body ?? "{}") : event.body;
	// Reject existing users registeration
	await UsersServices.validateUniqueEmail(email, event.logger);
	// Create a new user
	await UsersServices.create(email, event.logger);
	return { statusCode: 201, message: "User created successfully" };
};

export const handler = middy(insertUser)
	.use(LoggerMiddleware())
	.use(response());