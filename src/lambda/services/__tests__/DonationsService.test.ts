import DonationsServices from "../DonationsServices";
import DonationsRepository from "../../db/repositories/DonationsRepository";
import CustomError from "../../base/CustomError";
import EmailerSES from "../../base/EmailerSES";
import Logger from "../../base/Logger";

jest.mock("../../db/repositories/DonationsRepository");
jest.mock("../../base/EmailerSES");
jest.mock("../../base/Logger");

const mockSendEmail = jest.fn();

jest.mock("aws-sdk", () => {
	return {
		SES: jest.fn().mockImplementation(() => {
			return { sendEmail: mockSendEmail };
		})
	};
});

describe("Testing DonationServices Class", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});
	const logger = new Logger({} as any);
	describe("Testing create method", () => {
		it("Should call the create repo metho successfully", () => {
			const mockDonationData = { userId: "1", amount: 99 };
			DonationsServices.create(mockDonationData, logger);
			expect(DonationsRepository.create).toBeCalledWith(expect.objectContaining({ userId: "1", amount: 99 }));
		});
		it("Should throw an 404 error missing the userId", () => {
			const mockDonationData = { userId: "", amount: 99 };
			expect(
				() => DonationsServices.create(mockDonationData, logger)
			).toThrowError(
				new CustomError(
					404,
					"Cannot create a new donation, userId value is missing!",
					expect.objectContaining({
						userId: "",
						amount: 99
					})
				)
			);
		});
		it("Should throw an 400 error missing amount", () => {
			const mockDonationData = { userId: "1", amount: 0 };
			expect(
				() => DonationsServices.create(mockDonationData, logger)
			).toThrowError(
				new CustomError(
					400,
					"Cannot create a new donation, donation value is missing!",
					expect.objectContaining({
						userId: "1",
						amount: 0
					})
				)
			);
		});
	});

	describe("Testing sendThanks", () => {
		it("Should return undefined and should not send the thanks email", async () => {
			const mockEmail = "";
			const res = await DonationsServices.sendThanks(mockEmail, {count: 0} as any, logger);
			expect(res).toBe(undefined);
			expect(mockSendEmail).not.toBeCalled();
		});

		it("Should throw an error, missing the email", () => {
			const mockEmail = undefined;
			expect(
				DonationsServices.sendThanks(mockEmail as any, {count: 3} as any, logger)
			).rejects.toThrowError(
				new CustomError(
					400,
					"Cannot find donator data by given email!",
				)
			);
		});

		it("Should return undefined and send the thanks email", async () => {
			const mockEmail = "email";
			const res = await DonationsServices.sendThanks(mockEmail, {count: 3} as any, logger);
			expect(res).toBe(undefined);
		});
	});

});