import { addDonation } from "../post-donations";
import UsersServices from "../../services/UsersServices";
import DonationsServices from "../../services/DonationsServices";

jest.mock("../../middleware/LoggerMiddleware");
jest.mock("../../services/UsersServices");
jest.mock("../../services/DonationsServices");
function mockUse() {
	return {use: mockUse};
}
jest.mock("@middy/core", () => {
	return jest.fn().mockImplementation(() => {
		return {use: mockUse};
	});
});
describe("Testing post-donations handler", () => {
	const successResponse = { statusCode: 201, message: "Donation was added successfully!"};
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
		const response = await addDonation(mockEvent as any);
		expect(UsersServices.getUserByEmail).toBeCalledWith("testing@email.com", undefined);
		expect(UsersServices.create).not.toBeCalled();
		expect(DonationsServices.create).not.toBeCalledWith({
			amount: 99,
			userId: "testing-id"
		});
		expect(DonationsServices.sendThanks).toBeCalledWith("testing@email.com", undefined, undefined);
		expect(response).toEqual({...successResponse});
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
		const response = await addDonation(mockEvent as any);
		expect(UsersServices.getUserByEmail).toBeCalledWith("testing@email.com", undefined);
		expect(UsersServices.create).toBeCalledWith("testing@email.com", undefined);
		expect(DonationsServices.create).not.toBeCalledWith({
			amount: 99,
			userId: "testing-id"
		});
		expect(DonationsServices.sendThanks).toBeCalledWith("testing@email.com", undefined, undefined);
		expect(response).toEqual({...successResponse});
	});
});