import { insertDonation } from "../post-donations";
import UsersServices from "../../services/UsersServices";
import DonationsServices from "../../services/DonationsServices";

jest.mock("../../middlewares/LoggerMiddleware");
jest.mock("../../services/UsersServices");
jest.mock("../../services/DonationsServices");
// jest.mock("@middy/core", () => {
// 	return () => {};
// }); // Middy mocking

describe("Testing post-donations handler", () => {
	it("Should success without calling create user", async () => {
		const mockEvent = {
			body: JSON.stringify({
				email: "testing@email.com",
				amount: 99
			})
		};
		const mockUser = {
			id: "testing-id",
			email: "test@email.com"
		};
		const mockedGetUserByEmail = jest.fn().mockResolvedValueOnce(mockUser as any);
		UsersServices.getUserByEmail = mockedGetUserByEmail;
		const mockedSendThanks = jest.fn().mockResolvedValueOnce([]);
		DonationsServices.sendThanks = mockedSendThanks;
		const response = await insertDonation(mockEvent as any);
		expect(UsersServices.getUserByEmail).toBeCalledWith("testing@email.com", undefined);
		expect(UsersServices.create).not.toBeCalled();
		expect(DonationsServices.create).not.toBeCalledWith({
			amount: 99,
			userId: "testing-id"
		});
		expect(DonationsServices.sendThanks).toBeCalledWith("testing@email.com", undefined, undefined);
		expect(response).toBe(expect.objectContaining({message: "Donation Was inserted Successfully!"}));
	});
	it("Should successfully calling create user", async () => {
		const mockEvent = {
			body: JSON.stringify({
				email: "testing@email.com",
				amount: 99
			})
		};
		const mockUser = {
			id: "testing-id",
			email: "test@email.com"
		};
		const mockedGetUserByEmail = jest.fn().mockResolvedValueOnce(undefined);
		UsersServices.getUserByEmail = mockedGetUserByEmail;
		const mockedCreateUser = jest.fn().mockResolvedValueOnce(mockUser);
		UsersServices.create = mockedCreateUser;
		const mockedSendThanks = jest.fn().mockResolvedValueOnce([]);
		DonationsServices.sendThanks = mockedSendThanks;
		const response = await insertDonation(mockEvent as any);
		expect(UsersServices.getUserByEmail).toBeCalledWith("testing@email.com", undefined);
		expect(UsersServices.create).toBeCalledWith("testing@email.com", undefined);
		expect(DonationsServices.create).not.toBeCalledWith({
			amount: 99,
			userId: "testing-id"
		});
		expect(DonationsServices.sendThanks).toBeCalledWith("testing@email.com", undefined, undefined);
		expect(response).toBe(expect.objectContaining({message: "Donation Was inserted Successfully!"}));
	});
});