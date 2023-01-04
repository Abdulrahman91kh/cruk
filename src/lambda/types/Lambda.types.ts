import { APIGatewayEvent } from "aws-lambda";
import { Request } from "@middy/core";
import Logger from "../base/Logger";

export interface LambdaEvent extends APIGatewayEvent {
    logger: Logger;
}

export interface RequestWithLambdaEvent extends Request{
    event: LambdaEvent
}