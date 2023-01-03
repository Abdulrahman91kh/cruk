export default class CustomError extends Error {
    constructor(
        public readonly code=500,
        errorMessage="Internal Server Error!",
        public readonly data={}
    ) {
        super();
        this.message = errorMessage;
    }
};