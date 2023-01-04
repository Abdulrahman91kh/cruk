import EmailerSES from "../EmailerSES";
import getEmailTemplate from "./email-template";

const mockPromise = jest.fn();
const mockAwsSes = {
	sendEmail: jest.fn(() => ({
		promise: mockPromise
	})
	)
};

describe("Testing EmailerSES class", () => {
	it("Should call the aws-ses send function with parameters", () => {
		const mockArgs = {
			email: ["test@mail.com"],
			subject: "This is my testing subject",
			body: "This is my testing body",
			source: "source@email.com",
			ses: mockAwsSes
		};
		const emailer = new EmailerSES(mockArgs as any);
		emailer.send();
		const responseTemplate = getEmailTemplate(mockArgs);
		expect(mockAwsSes.sendEmail).toBeCalledWith(responseTemplate);
	});
});