import usersModel from "../model/UsersModel";
import * as uuid from "uuid";

export default class UsersRepository {

    /**
     * Subscribe a new user, email douplication is not accepted
     * @param email 
     * @returns 
     */
	public static async create (email: string) {
		return usersModel.create({
			id: uuid.v4(),
			email
		});
	}

    /**
     * Finding user data by user's email
     * @param email 
     * @returns 
     */
	public static findByEmail(email: string) {
		return usersModel.query("email").eq(email).using("userEmailIndex").exec();
	}
}