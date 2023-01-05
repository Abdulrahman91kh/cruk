import Logger  from "../base/Logger";
import middy, { Request } from "@middy/core";
import { APIGatewayProxyResult } from "aws-lambda";
import { LambdaEvent } from "../types/Lambda.types";
import pino from "pino";

/**
 * Middleware responsible for adding a logger instance to an event.
 * Injects logger with the event's correlation-id. If not present creates one. 
 */
export const LoggerMiddleware = (): middy.MiddlewareObj<LambdaEvent, APIGatewayProxyResult> => {
  
	const before: middy.MiddlewareFn<LambdaEvent, APIGatewayProxyResult> =  (request: Request): void => {
		const logger = pino({});
		injectLogger(request, new Logger(logger));
	};
	return { before };
};

export const injectLogger = (request: Request, logger: Logger) => {
	const { context } = request;
	logger.init(context);
	request.event.logger = logger;
};