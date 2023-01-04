import DonationsServices from "../DonationsServices";
import DonationsRepository from "../../db/repositories/Donations";
import CustomError from "../../base/CustomError";

jest.mock("../../db/repositories/Donations");

describe("Testing DonationServices Class", () => {
	describe("Testing create method", () => {
		it("Should call the create repo metho successfully", () => {
			const mockDonationData = { userId: "1", amount: 99 };
			DonationsServices.create(mockDonationData);
			expect(DonationsRepository.create).toBeCalledWith(expect.objectContaining({ userId: "1", amount: 99 }));
		});
		it("Should throw an 404 error missing the userId", () => {
			const mockDonationData = { userId: "", amount: 99 };
			expect(
				() => DonationsServices.create(mockDonationData)
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
				() => DonationsServices.create(mockDonationData)
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

	// describe("Testing sendThanks", () => {

	// });

});