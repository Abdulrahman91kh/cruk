import UserService from "../UsersServices";
import UsersRepository from "../../db/repositories/UsersRepository";
import CustomError from "../../base/CustomError";
import Logger from "../../base/Logger";

jest.mock("../../db/repositories/UsersRepository");
jest.mock("../../base/Logger");

describe("Testing UsersService class", () => {
	const logger = new Logger({} as any);
	it("Should call the repo create fn with params", () => {
		const mockedEmail = "test@email.com";
		UserService.create(mockedEmail, logger);
		expect(UsersRepository.create).toBeCalledWith("test@email.com");
	});
	it("Should call the repo create fn with params", async () => {
		const mockedEmail = "test@email.com";
		const mockedFindByEmail = jest.fn().mockResolvedValueOnce([1]);
		UsersRepository.findByEmail = mockedFindByEmail;
		const result = await UserService.getUserByEmail(mockedEmail, logger);
		expect(mockedFindByEmail).toBeCalledWith("test@email.com");
		expect(result).toBe(1);
	});
	describe("Testing validateUniqueEmail", () => {

		it("Should return true", async () => {
			const mockedEmail = "test@email.com";
			const mockedFindByEmail = jest.fn().mockResolvedValueOnce([]);
			UsersRepository.findByEmail = mockedFindByEmail;
			const result = await UserService.validateUniqueEmail(mockedEmail, logger);
			expect(result).toBe(true);
			expect(UsersRepository.findByEmail).toBeCalledWith("test@email.com");
		});

		it("Should throw an error missing email", async() => {
			const mockedEmail = "test@email.com";
			const mockedFindByEmail = jest.fn().mockResolvedValueOnce(["result"]);
			UsersRepository.findByEmail = mockedFindByEmail;
			expect(UserService.validateUniqueEmail(mockedEmail, logger))
				.rejects.toThrowError(
					new CustomError(
						400,
						"Cannot create new user, Email already exists!"
					)
				);
			expect(UsersRepository.findByEmail).toBeCalledWith("test@email.com");
		});

	});
});