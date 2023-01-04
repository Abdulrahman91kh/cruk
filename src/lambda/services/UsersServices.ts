import CustomError from "../base/CustomError";
import UsersRepository from "../db/repositories/UsersRepository";

export default class UserService {
   
	public static async create (email: string) {
		return UsersRepository.create(email);
	}

	public static async getUserByEmail (email: string) {
		return (await UsersRepository.findByEmail(email))[0];
      
	}

	public static async validateUniqueEmail(email: string) { // TEST
		const something = (await UsersRepository.findByEmail(email))[0];
		if(something) {
			throw new CustomError(400, "Cannot create new user, Email is already exists!");
		}
		return true;
	}
}