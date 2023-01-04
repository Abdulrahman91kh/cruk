import usersModel from "../model/Users";
import * as uuid from "uuid";

export default class UsersRepository {

	static async create (email: string) {
		return usersModel.create({
			id: uuid.v4(),
			email
		});
	}

	static findByEmail(email: string) {
		return usersModel.query("email").eq(email).using("userEmailIndex").exec();
	}
}