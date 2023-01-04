import DonationsModel from "../model/DonationsModel";
import { CreateDonation } from "../../types/donation.types";
import * as uuid from "uuid";

export default class DonationsRepository {

	static async create (data: CreateDonation) {
		return DonationsModel.create({
			...data,
			id: uuid.v4()
		});
	}

	static findDonationsByUserId (userId: string) {
		return DonationsModel.query("userId").eq(userId).using("userIdIndex").exec();
	}
  
}