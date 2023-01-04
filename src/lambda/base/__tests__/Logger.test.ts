import Logger from "../Logger";
import * as Pino from "pino";

const mockPino = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
};

describe("Testing Logger Base Class", () => {
	//Mocks
	const mockPinoOptions = {};
	const mockContext = {
		logGroupName: "TestingGroupName"
	};
	const mockTags = ["ThisIsMyTag"];

	it("Should set the logger channel", () => {
		const logger = new Logger(mockPino as any);
		logger.init(mockContext as any);
		expect(logger.channel).toBe("TestingGroupName");
	});

	it("Should call pino logger info method", () => {
		const logger = new Logger(mockPino as any);
		logger.init(mockContext as any);
		logger.info("This is an info message", mockTags);
		expect(mockPino.info).toBeCalledWith(expect.objectContaining({
			message: "This is an info message",
			channel: "TestingGroupName",
			level_name: "info",
			tags: expect.arrayContaining(["ThisIsMyTag"])
		}));
	});

	it("Should call pino logger warn method", () => {
		const logger = new Logger(mockPino as any);
		logger.init(mockContext as any);
		logger.warn("This is an warnning message", mockTags);
		expect(mockPino.warn).toBeCalledWith(expect.objectContaining({
			message: "This is an warnning message",
			channel: "TestingGroupName",
			level_name: "warn",
			tags: expect.arrayContaining(["ThisIsMyTag"])
		}));
	});

	it("Should call pino logger error method", () => {
		const logger = new Logger(mockPino as any);
		logger.init(mockContext as any);
		logger.error("This is an error message", mockTags);
		expect(mockPino.error).toBeCalledWith(expect.objectContaining({
			message: "This is an error message",
			channel: "TestingGroupName",
			level_name: "error",
			tags: expect.arrayContaining(["ThisIsMyTag"])
		}));
	});


});