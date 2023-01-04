import CustomError from "../base/CustomError";
import Logger from "../base/Logger";
import UsersRepository from "../db/repositories/UsersRepository";

export default class UserService {
   
	/**
     * Create a new user
     * @param email 
     * @param logger Logger
     * @returns 
     */
	public static async create (email: string, logger: Logger) {
		logger.info("Creating a new user account...");
		return UsersRepository.create(email);
	}

	/**
     * Get user data by Email
     * @param email 
     * @param logger Logger
     * @returns 
     */
	public static async getUserByEmail (email: string, logger: Logger) {
		logger.info("Trying to find user by email...");
		return (await UsersRepository.findByEmail(email))[0];
	}

	/**
     * Checks if the user email is unique returns true
     * Throws an error if the user email is not unique
     * @param email 
     * @param logger 
     * @returns 
     */
	public static async validateUniqueEmail(email: string, logger: Logger) {
		logger.info("Trying to validate the uniqueness of email...");
		if((await UsersRepository.findByEmail(email))[0]) {
			logger.warn("email is not unique");
			throw new CustomError(400, "Cannot create new user, Email is already exists!");
		}
		logger.info("email is unique!");
		return true;
	}
}