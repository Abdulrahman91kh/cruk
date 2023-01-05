import { injectLogger } from "../LoggerMiddleware";

describe("Testing LoggerMiddleware", () => {
	const mockRequest = {
		context: "Testing",
		event: {}
	};
	const mockLogger = {
		init: jest.fn()
	};
	it("Should ingject the logger to the request", () => {
		injectLogger(mockRequest as any, mockLogger as any);
		expect(mockLogger.init).toBeCalledWith("Testing");
		expect(mockRequest.event).toHaveProperty("logger", mockLogger);
	});
});