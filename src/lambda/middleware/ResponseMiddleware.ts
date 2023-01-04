import middy, { Request } from "@middy/core";
import { APIGatewayProxyResult } from "aws-lambda";
import CustomError from "../base/CustomError";
import { LambdaEvent } from "../types/Lambda.types";

export const response = (): middy.MiddlewareObj<LambdaEvent, APIGatewayProxyResult> => {
  
	const after: middy.MiddlewareFn<LambdaEvent, APIGatewayProxyResult> =  (request: Request): void => {
		request.response = {
			statusCode: 200,
			body: JSON.stringify(request.response),
		};
	};
	const onError: middy.MiddlewareFn<LambdaEvent, APIGatewayProxyResult> =  (request: Request): void => {
		const error = request.error;
		const CLIENT_ERRORS = [400, 404];
		if(error instanceof CustomError && CLIENT_ERRORS.includes(error.code)) {
			request.response = {
				statusCode: error.code,
				body: JSON.stringify({
					message: error.message,
					data: error.data
				})
			};
			return;
		}
        const { event, context } = request;
		if(error instanceof CustomError) {
            event.logger.error(
                error.message,
                [context.functionName],
                JSON.stringify(error)
            );
            request.response = {
                statusCode: error.code,
                body: JSON.stringify({message: "Internal Server Error!"})
            };
        }
		event.logger.error(
			error,
			[context.functionName],
            JSON.stringify(error)
		);
		request.response = {
			statusCode: 500,
			body: JSON.stringify({message: "Internal Server Error!"})
		};
	};
	return { after, onError };
};