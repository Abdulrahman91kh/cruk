import CustomError from "../base/CustomError";
import DonationsRepository from "../db/repositories/Donations";
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
		if(!email) {
			throw new CustomError(400, "Cannot find donator data by given email!");
		}
		if(existingDonations.length < 2) {
			return;
		}
		//Should Say thanks
	};

	public static getDonationsByUserId = (userId: string) => {
		return DonationsRepository.findDonationsByUserId(userId);
	};

}