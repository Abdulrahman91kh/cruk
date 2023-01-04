import UserService from "../UsersServices";
import UsersRepository from "../../db/repositories/UsersRepository";
import CustomError from "../../base/CustomError";

jest.mock("../../db/repositories/UsersRepository");

describe("Testing UsersService class", () => {
	it("Should call the repo create fn with params", () => {
		const mockedEmail = "test@email.com";
		UserService.create(mockedEmail);
		expect(UsersRepository.create).toBeCalledWith("test@email.com");
	});
	it("Should call the repo create fn with params", async () => {
		const mockedEmail = "test@email.com";
		const mockedFindByEmail = jest.fn().mockResolvedValueOnce([1]);
		UsersRepository.findByEmail = mockedFindByEmail;
		const result = await UserService.getUserByEmail(mockedEmail);
		expect(mockedFindByEmail).toBeCalledWith("test@email.com");
		expect(result).toBe(1);
	});
	describe("Testing validateUniqueEmail", () => {

		it("Should return true", async () => {
			const mockedEmail = "test@email.com";
			const mockedFindByEmail = jest.fn().mockResolvedValueOnce([]);
			UsersRepository.findByEmail = mockedFindByEmail;
			const result = await UserService.validateUniqueEmail(mockedEmail);
			expect(result).toBe(true);
			expect(UsersRepository.findByEmail).toBeCalledWith("test@email.com");
		});

		it("Should throw an error missing email", async() => {
			const mockedEmail = "test@email.com";
			const mockedFindByEmail = jest.fn().mockResolvedValueOnce(["result"]);
			UsersRepository.findByEmail = mockedFindByEmail;
			expect(UserService.validateUniqueEmail(mockedEmail))
				.rejects.toThrowError(
					new CustomError(
						400,
						"Cannot create new user, Email is already exists!"
					)
				);
			expect(UsersRepository.findByEmail).toBeCalledWith("test@email.com");
		});

	});
});