import middy from "@middy/core";
import DonationServices from "../../services/DonationsServices";
import UsersServices from "../../services/UsersServices";
import { LoggerMiddleware } from "../../middleware/LoggerMiddleware";
import { LambdaEvent } from "../../types/Lambda.types";
import { response } from "../../middleware/ResponseMiddleware";

export const addDonation = async (event: LambdaEvent) => {
	const { email, amount } = typeof event.body === "string" 
		? JSON.parse(event.body ?? "{}") : event.body;
	let user = await UsersServices.getUserByEmail(email, event.logger);
	if(!user) {
		user = await UsersServices.create(email, event.logger);
	}
	// create a new donation record
	await DonationServices.create({
		amount: parseInt(amount),
		userId: user.id,
	}, event.logger);
	// Getting all existing donations for this user to be sent to the sendThanks method
	// This done to keep layer dispatching services, and avoid dispatching services from services
	const donationsCount = await DonationServices.countDonationsByUserId(user.id, event.logger);
	await DonationServices.sendThanks(email, donationsCount, event.logger);
	return { statusCode: 201, message: "Donation was added successfully!"};
};

export const handler = middy(addDonation)
	.use(LoggerMiddleware())
	.use(response());