import DontaionRepository from "../DonationsRepository";
import DonationsModel from "../../model/DonationsModel";
import * as uuid from "uuid";

jest.mock("../../model/DonationsModel");
jest.mock("uuid");

describe("Testing Donations Repository Class", () => {
   
	it("Should test create by calling model create args", async () => {
		const mockArgs = {email: "test@email.com"};
		const mockUuid = jest.spyOn(uuid, "v4").mockReturnValueOnce("1");
		await DontaionRepository.create(mockArgs as any);
		expect(DonationsModel.create).toBeCalledWith(expect.objectContaining({
			email: "test@email.com",
			id: "1"
		}));
		expect(mockUuid).toBeCalled();
	});

	it("Should test findDonationByUserId, it would call model fns with args", async () => {
		const mockUserId = "1";
		const mockExecFn = jest.fn();
		const mockCountFn = jest.fn().mockImplementation(() => ({
			exec: mockExecFn
		}));
		const mockUsingFn = jest.fn().mockImplementation(() => ({
			count: mockCountFn
		}));
		const mockEqFn = jest.fn().mockImplementation(() => ({
			using: mockUsingFn
		}));
		DonationsModel.query = jest.fn().mockImplementation(() => ({
			eq: mockEqFn
		}));
		await DontaionRepository.countDonationsByUserId(mockUserId);
		expect(DonationsModel.query).toBeCalledWith("userId");
		expect(mockEqFn).toBeCalledWith("1");
		expect(mockUsingFn).toBeCalledWith("userIdIndex");
		expect(mockCountFn).toBeCalled();
		expect(mockExecFn).toBeCalled();
	});
});