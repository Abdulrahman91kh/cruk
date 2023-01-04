import * as  dynamoose from "dynamoose";
import { User } from "../../types/users.types";

const { USERS_TABLE } = process.env;

const Schema = new dynamoose.Schema(
	{
		id: {
			type: String,
			hashKey: true,
			required: true
		},
		email: {
			type: String,
			required: true,
			index:   {
				name: "userEmailIndex",
				project: true,
				type: "global",
			}
		},
	},
);

export default dynamoose.model<User>(USERS_TABLE, Schema);