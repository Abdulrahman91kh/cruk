import UserService from "../../services/UsersServices";
import { insertUser } from "../post-users";
jest.mock("../../middleware/LoggerMiddleware");
jest.mock("../../services/UsersServices");
function mockUse() {
	return {use: mockUse};
}
jest.mock("@middy/core", () => {
	return jest.fn().mockImplementation(() => {
		return {use: mockUse};
	});
});
describe("Testing users handler", () => {
	const mockEvent = {
		body: JSON.stringify({
			email: "testing@email.com",
		}),
		logger: {}
	};
	it("Should call userServices validateEmail and create as well", async () => {
		const response = await insertUser(mockEvent as any);
		expect(UserService.validateUniqueEmail).toBeCalledWith("testing@email.com", mockEvent.logger);
		expect(UserService.create).toBeCalledWith("testing@email.com", mockEvent.logger);
		expect(response).toEqual({ statusCode: 201, message: "User created successfully" });
	});
});