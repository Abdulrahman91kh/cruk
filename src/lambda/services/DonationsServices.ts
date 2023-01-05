import { SES } from "aws-sdk";
import EmailerSES from "../base/EmailerSES";
import CustomError from "../base/CustomError";
import DonationsRepository from "../db/repositories/DonationsRepository";
import { CountResponse, CreateDonation, Donation } from "../types/donation.types";
import Logger from "../base/Logger";

export default class DonationsServices {
    
	/**
     * This method inserts a new donation record
     * It would throw a 404 error if the `userId` is missing
     * It would throw a 400 error if the `amount` is mising
     * @param { data } userId
     * @param { data } amount donations in £
     * @param logger 
     * @returns 
     */
	public static create (data: CreateDonation, logger: Logger) {
		const { userId, amount } = data;
		logger.info(`Trying to create a new donation for userId ${userId}`);
		if(!userId || userId === "") {
			logger.warn("Cannot create a new donation without a userId value");
			throw new CustomError(404, "Cannot create a new donation, userId value is missing!", data);
		}
		if(!amount ) {
			logger.warn("Cannot create a new donation without a donation value");
			throw new CustomError(400, "Cannot create a new donation, donation value is missing!", data);
		}
		logger.info("Creating a new donation record...");
		return DonationsRepository.create(data);
	}
    
	/**
     * Send a thanks email to donators who donated more than twice.
     * @param email 
     * @param donationsCount 
     * @param logger 
     * @returns 
     */
	public static sendThanks = async (email: string, donationsCount: CountResponse, logger: Logger) => {
		logger.info("Entering the thanksSender method");
		if(donationsCount.count < 2) {
			logger.info("No emails would be sent since user's donations are less than 2");
			return;
		}
		if(!email || email === "") {
			logger.warn("Cannot send an email to undefined email");
			throw new CustomError(400, "Cannot find donator data by given email!");
		}
		const ses = new SES({apiVersion: "2010-12-01"});
		logger.info("Perparing to send an email...");
		const emailer = new EmailerSES({
			email: [email],
			body: "Thanks for your multiple donations",
			source: process.env.SES_SOURCE_EMAIL,
			subject: "Thanks for your multiple donations, Hero!",
			ses
		});
		logger.info("Sending a thanks email...");
		/**
         *  This function would throw an error because it is used in sandbox
         *  But if it is requested to be prod, it would work
         **/
		await emailer.send();

	};

	/**
     * Get the count of donations done by a specific hero
     * @param userId 
     * @param logger 
     * @returns 
     */
	public static countDonationsByUserId = (userId: string, logger: Logger) => {
		logger.info(`Trying to get dontaitons for userId: ${userId}}`);
		return DonationsRepository.countDonationsByUserId(userId);
	};

}