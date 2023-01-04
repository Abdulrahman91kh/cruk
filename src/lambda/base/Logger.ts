import * as Pino from "pino";
import { LEVELS, LogStandard } from "./types/logger.types";
import { Context } from "aws-lambda";

export default class Logger {
    
	private static readonly LEVELS: LEVELS;
    
	private logger: Pino.Logger;
	public channel: string;
    /**
     * this class helps to produce more structural helpful logs,
     * that we can query and filter using cloudwatch insights
     * @param pinoInstance as an injected dependency
     */
	constructor (pinoInstance: Pino.Logger) {
		this.logger = pinoInstance;
	}

	init(context: Context) {
		this.channel = context.logGroupName ?? "";
	}

	info (msg: string, tags?: string[]): void {
		this.logger.info(this._toLogStandard(LEVELS.INFO, msg, tags));
	}

	warn (msg: string, tags?: string[]): void {
		this.logger.warn(this._toLogStandard(LEVELS.WARNING, msg, tags));
	}
    
	error (msg: string, tags?: string[]): void {
		this.logger.error(this._toLogStandard(LEVELS.ERROR, msg, tags));
	}

	debug (msg: string, tags?: string[]): void {
		this.logger.debug(this._toLogStandard(LEVELS.DEBUG, msg, tags));
	}
	private _toLogStandard (level: string, msg: string, tags: string[] = []): LogStandard {
		return {
			message: msg,
			channel: this.channel,
			level_name: level,
			tags,
		};
	}
}
