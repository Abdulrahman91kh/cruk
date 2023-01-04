import CustomError from "../CustomError";

describe("Testing Custom Error Base Class", () => {

	it("Should have initiate code, message and data", () => {
		const mockErrorCode = 400;
		const mockErrorMessage = "TestingMessage";
		const mockErrorData = {id: 1};
		const error = new CustomError(mockErrorCode, mockErrorMessage, mockErrorData);
		expect(error.code).toBe(400);
		expect(error.message).toBe("TestingMessage");
		expect(error.data).toEqual(expect.objectContaining({
			id: 1
		}));
	});
});