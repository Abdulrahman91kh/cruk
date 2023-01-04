import * as  dynamoose from "dynamoose";
import { Donation } from "../../types/donation.types";

const { DONATION_TABLE } = process.env;

const Schema = new dynamoose.Schema(
	{
		id: {
			type: String,
			hashKey: true,
			required: true
		},
		amount: {
			type: Number,
			required: true
		},
		userId: {
			type: String,
			required: true,
			index:   {
				name: "userIdIndex",
				project: true,
				type: "global",
			}
		}
	},
	{
		timestamps: {
			createdAt: "createdAt",
		}
	}
);

export default dynamoose.model<Donation>(DONATION_TABLE, Schema);