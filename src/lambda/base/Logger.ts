import * as Pino from 'pino';
import { LEVELS, LogStandard } from './types/logger.types';
import { Context } from 'aws-lambda';

class Logger {
    
    static readonly LEVELS: LEVELS
    
    public logger: Pino.Logger
    public channel: string
  
    constructor (args: Pino.LoggerOptions = {}) {
        this.logger = Pino.pino(args)
    }

    init(context: Context) {
        this.channel = context.logGroupName ?? ''
    }

    info (msg: string, tags?: string[]): void {
        this.logger.info(this.toLogStandard(LEVELS.INFO, msg, tags))
    }

    warn (msg: string, tags?: string[]): void {
        this.logger.warn(this.toLogStandard(LEVELS.WARNING, msg, tags))
    }
    
    error (msg: string, tags?: string[]): void {
        this.logger.error(this.toLogStandard(LEVELS.ERROR, msg, tags))
    }

    debug (msg: string, tags?: string[]): void {
        this.logger.debug(this.toLogStandard(LEVELS.DEBUG, msg, tags))
    }
    toLogStandard (level: string, msg: string, tags: string[] = []): LogStandard {
        return {
          message: msg,
          channel: this.channel,
          level_name: level,
          tags,
        }
    }
}

export default Logger;