import UsersRepositories from "../UsersRepository";
import UsersModel from "../../model/UsersModel";
import * as uuid from "uuid";

jest.mock("../../model/UsersModel");
jest.mock("uuid");

describe("Testing Donations Repository Class", () => {
   
	it("Should test create by calling model create args", async () => {
		const mockArgs = "test@email.com";
		const mockUuid = jest.spyOn(uuid, "v4").mockReturnValueOnce("1");
		await UsersRepositories.create(mockArgs as any);
		expect(UsersModel.create).toBeCalledWith(expect.objectContaining({
			email: "test@email.com",
			id: "1"
		}));
		expect(mockUuid).toBeCalled();
	});

	it("Should test findByEmail, it would call model fns with args", async () => {
		const mockUserEmail = "test@email.com";
		const mockExecFn = jest.fn();
		const mockUsingFn = jest.fn().mockImplementation(() => ({
			exec: mockExecFn
		}));
		const mockEqFn = jest.fn().mockImplementation(() => ({
			using: mockUsingFn
		}));
		UsersModel.query = jest.fn().mockImplementation(() => ({
			eq: mockEqFn
		}));
		await UsersRepositories.findByEmail(mockUserEmail);
		expect(UsersModel.query).toBeCalledWith("email");
		expect(mockEqFn).toBeCalledWith("test@email.com");
		expect(mockUsingFn).toBeCalledWith("userEmailIndex");
		expect(mockExecFn).toBeCalled();
	});
});