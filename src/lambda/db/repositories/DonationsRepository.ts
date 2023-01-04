import DonationsModel from "../model/DonationsModel";
import { CreateDonation } from "../../types/donation.types";
import * as uuid from "uuid";

export default class DonationsRepository {
    /**
     * Inserting a new donation entry in the donation dynamodb table
     * @param { data } userId the hero who donated
     * @param { data } amount the donation amount
     * @returns 
     */
	public static async create (data: CreateDonation) {
		return DonationsModel.create({
			...data,
			id: uuid.v4()
		});
	}

    /**
     * Getting donations count by userId
     * @param userId 
     * @returns Promise<CountResponse>
     */
	public static countDonationsByUserId (userId: string) {
		return DonationsModel.query("userId").eq(userId).using("userIdIndex").count().exec();
	}
  
}