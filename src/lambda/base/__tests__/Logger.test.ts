import Logger from "../Logger";
import * as Pino from "pino";

const mockPino = jest.fn();
const mockInfo = jest.fn();
const mockWarn = jest.fn();
const mockError = jest.fn();

jest.mock("pino", () => ({
	pino: (args: any) => mockPino.mockImplementation(() => {
		return {
			info: mockInfo,
			warn: mockWarn,
			error: mockError
		};
	})(args)
}));

describe("Testing Logger Class", () => {
	//Mocks
	const mockPinoOptions = {};
	const mockContext = {
		logGroupName: "TestingGroupName"
	};
	const mockMessage = "ThisIsMyMessage";
	const mockTags = ["ThisIsMyTag"];

	it("Should got intiate pino logger in the constructor", () => {
		new Logger(mockPinoOptions);
		expect(mockPino).toBeCalledWith({});
	});

	it("Should set the logger channel", () => {
		const logger = new Logger(mockPinoOptions);
		logger.init(mockContext as any);
		expect(logger.channel).toBe("TestingGroupName");
	});

	it("Should call pino logger info method", () => {
		const logger = new Logger(mockPinoOptions);
		logger.init(mockContext as any);
		logger.info("This is an info message", mockTags);
		expect(mockInfo).toBeCalledWith(expect.objectContaining({
			message: "This is an info message",
			channel: "TestingGroupName",
			level_name: "info",
			tags: expect.arrayContaining(["ThisIsMyTag"])
		}));
	});

	it("Should call pino logger warn method", () => {
		const logger = new Logger(mockPinoOptions);
		logger.init(mockContext as any);
		logger.warn("This is an warnning message", mockTags);
		expect(mockWarn).toBeCalledWith(expect.objectContaining({
			message: "This is an warnning message",
			channel: "TestingGroupName",
			level_name: "warn",
			tags: expect.arrayContaining(["ThisIsMyTag"])
		}));
	});

	it("Should call pino logger error method", () => {
		const logger = new Logger(mockPinoOptions);
		logger.init(mockContext as any);
		logger.error("This is an error message", mockTags);
		expect(mockError).toBeCalledWith(expect.objectContaining({
			message: "This is an error message",
			channel: "TestingGroupName",
			level_name: "error",
			tags: expect.arrayContaining(["ThisIsMyTag"])
		}));
	});


});