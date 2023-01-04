import { SES } from "aws-sdk";
import EmailerSES from "../base/EmailerSES";
import CustomError from "../base/CustomError";
import DonationsRepository from "../db/repositories/DonationsRepository";
import { CreateDonation, Donation } from "../types/donation.types";

export default class DonationsServices {
    
	public static create (data: CreateDonation) {
		const { userId, amount } = data; //should be amount
		if(!userId || userId === "") {
			throw new CustomError(404, "Cannot create a new donation, userId value is missing!", data);
		}
		if(!amount ) {
			throw new CustomError(400, "Cannot create a new donation, donation value is missing!", data);
		}
		return DonationsRepository.create(data);
	}
    

	public static sendThanks = async (email: string, existingDonations: Donation[]) => {
		if(existingDonations.length < 2) {
			return;
		}
		if(!email || email === "") {
			throw new CustomError(400, "Cannot find donator data by given email!");
		}
		const ses = new SES({apiVersion: "2010-12-01"});
		const emailer = new EmailerSES({
			email: [email],
			body: "Thanks for your multiple donations",
			source: process.env.SES_SOURCE_EMAIL,
			subject: "Thanks for your multiple donations, Hero!",
			ses
		});
		// This function would throw an error because it is used in sandbox
		// But if it is requested to be prod, it would work
		await emailer.send();

	};

	public static getDonationsByUserId = (userId: string) => {
		return DonationsRepository.findDonationsByUserId(userId);
	};

}