
export default class CustomError extends Error {
	/**
     * This error would introduce more capability to help debuging issues
     * @param code status code
     * @param errorMessage body of a text message
     * @param data NONE-SENSITIVE data that should go to logs
     */
	constructor(
        public readonly code = 500,
        errorMessage="Internal Server Error!",
        public readonly data={}
	) {
		super();
		this.message = errorMessage;
	}
}