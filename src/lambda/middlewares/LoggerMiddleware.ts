import Logger  from '../base/Logger';
import middy from '@middy/core';
import { APIGatewayProxyResult } from 'aws-lambda';
import { LambdaEvent } from '../types/Lambda.types';

/**
 * Middleware responsible for adding a logger instance to an event.
 * Injects logger with the event's correlation-id. If not present creates one. 
 */
export const LoggerMiddleware = (): middy.MiddlewareObj<LambdaEvent, APIGatewayProxyResult> => {
  
  const before: middy.MiddlewareFn<LambdaEvent, APIGatewayProxyResult> =  (request): void => {
      const { context } = request
      const lambdaLogger = new Logger({})
      lambdaLogger.init(context)
      request.event.logger = lambdaLogger;
  }
  return { before };
}