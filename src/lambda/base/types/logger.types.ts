import { APIGatewayEvent, Context } from "aws-lambda";

export enum LEVELS {
    INFO = "info",
    ERROR = "error",
    WARNING = "warn",
    DEBUG = "debug"
}

export interface LogStandard {
    message: string;
    channel: string;
    level_name: string;
    tags: string[];
}