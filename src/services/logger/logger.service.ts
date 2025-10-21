import { Injectable, Logger as NestLogger, Scope } from '@nestjs/common';

enum TerminalColorCode {
  Green = '32',
  Yellow = `33`,
  Red = '31',
  MagentaBright = '95',
  CyanBright = '96',
  Gray = '30;1',
}

enum LogLevel {
  Log = 'LOG',
  Error = 'ERR',
  Warn = 'WAR',
  Debug = 'DEB',
  Verbose = 'VER',
}

/**
 * Maps the various log levels to a terminal color
 *
 * @author jordanskomer
 * @since 0.0.1
 */
const LEVEL_TO_COLOR = {
  LOG: TerminalColorCode.Green,
  ERR: TerminalColorCode.Red,
  WAR: TerminalColorCode.Yellow,
  DEB: TerminalColorCode.Gray,
  VER: TerminalColorCode.MagentaBright,
};

/**
 * Will convert the passed in text to one of the defined terminal colors if we are in an environment that supports displaying colors
 *
 * @param text - The text to convert
 * @param color - The color to change the text too
 * @author jordanskomer
 */
const toColor = (text: string, color: TerminalColorCode): string =>
  SUPPORTS_COLOR ? `\x1B[${color}m${text}\x1B[39m` : text;

/**
 * Converts a log level to the appropriately defined Terminal Color code
 *
 * @param level - The log level to get the terminal color code for
 * @author jordanskomer
 */
const levelToColor = (level: LogLevel): string =>
  toColor(level.toString(), LEVEL_TO_COLOR.hasOwnProperty(level) ? LEVEL_TO_COLOR[level] : TerminalColorCode.Gray);

/**
 * Define the TIME and DATE formats used by the logger
 * DATE: Month, Day, Year
 * TIME: HH:MM:SS
 *
 * @author jordanskomer
 */
const DATE_FORMATS = {
  DATE: new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }),
  TIME: new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }),
};

/**
 * The size of the max the [context] portion of the log can be
 *
 * @author jordanskomer
 */
const CONTEXT_MAX_LENGTH = 12;

const SUPPORTS_COLOR = process.env.ENV === 'local';

/**
 * Formats a date or time using the defined date formats
 *
 * @author jordanskomer
 */
const getFormattedDateOrTime = (date: Date, type: 'DATE' | 'TIME'): string => DATE_FORMATS[type].format(date);

const out = (message: string, insertNewLine = true): boolean =>
  process.stdout.write(message + (insertNewLine ? '\n' : ''));

let lastTimestamp;

/**
 * Extends default logger for better logs and future support for outputting logs to an external service
 *
 * @docs https://docs.nestjs.com/techniques/logger
 * @author jordanskomer
 * @since 0.0.1
 */
@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends NestLogger {
  constructor(context?: string) {
    super();
    if (context) this.setContext(context);
  }
  /**
   * The system level method for outputting the log.
   *
   * @todo Support external logging platforms
   * @param message - The message to output
   * @author jordanskomer
   */
  private out(message: string, insertNewLine = true): void {
    process.stdout.write(message + (insertNewLine ? '\n' : ''));
  }

  /**
   * Returns the log info in the below format. it will ensure and pad the string out to 71 characters to ensure
   * all of the log messages are inline for better and easier readability
   *
   * @param level - The level that is being logged
   * @author jordanskomer
   */
  private getInfo(now: Date, level: LogLevel): string {
    // No need for info as CloudWatch shows this in logging
    let info =
      process.env.ENV === 'local' ? `${toColor(getFormattedDateOrTime(now, 'TIME'), TerminalColorCode.Gray)} ` : '';
    info += `[${levelToColor(level)}]`;

    if (this.context) {
      info += `[${toColor(this.context, TerminalColorCode.CyanBright)}] `;
      return info.padEnd(61);
    }

    // We need to subtract the magenta color code that context would have from the padding
    // I.e. \x1B[95m\x1B[39m
    return info.padEnd(61 - (SUPPORTS_COLOR ? 10 : 0));
  }
  /**
   * Write a message to the console. Every message will follow the below format. NOTE:
   * If we are on a new day since the last time we echoed out a log or if this is the first log
   * it will first insert the new day line. This keeps our logs more clean as we only need the time vs the date and time
   * for every line of log output.
   *
   * Format: HH:MM:SS [LOGLEVEL] [CONTEXT] Message
   *
   * @param level
   * @param message
   */
  private say(level: LogLevel, message: string, details?: unknown): void {
    const now = new Date(Date.now());

    // if (!lastTimestamp || now.getUTCDate() > lastTimestamp.getUTCDate()) {
    //   lastTimestamp = now;
    //   out(`\n${toColor(getFormattedDateOrTime(now, 'DATE'), TerminalColorCode.MagentaBright)}\n`);
    // }

    out(this.getInfo(now, level) + message);

    if (details) {
      out(this.getInfo(now, level) + '\t' + JSON.stringify(details));
    }
  }

  /**
   * Checks to see if the context of the current logger service is new and will
   * update the context and ensure it is under 20 characters long.
   *
   * @param context - (20 Chars) The context that is calling the logging service
   */
  setContext(context: string) {
    context = context.trim().slice(0, CONTEXT_MAX_LENGTH);
    if (this.context !== context) {
      this.context = context;
    }
  }
  /**
   * Retrieves the current context of the logger
   *
   * @returns {string} The currently set context
   * @since 0.0.1
   * @author jordanskomer
   */
  getContext(): string {
    return this.context;
  }

  /**
   * Removes the context and resets the padding length
   *
   * @author jordanskomer
   */
  clearContext() {
    this.context = undefined;
  }

  log(message: string, details?: unknown) {
    this.say(LogLevel.Log, message, details);
  }
  error(message: string, trace?: string, details?: unknown) {
    this.say(LogLevel.Error, message, details);
  }
  warn(message: string, details?: unknown) {
    this.say(LogLevel.Warn, message, details);
  }
  debug(message: string, details?: unknown) {
    this.say(LogLevel.Debug, message, details);
  }
  verbose(message: string, details?: unknown) {
    this.say(LogLevel.Verbose, message, details);
  }
}
