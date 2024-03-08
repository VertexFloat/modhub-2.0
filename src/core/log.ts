import { ILog, TLogLevel, TLogType } from "../models/log.model";
import { formatString } from "../helpers/string";

class Log {
  message(level: TLogLevel, message: string, type?: TLogType): void {
    const log: ILog = {
      level: level,
      message: message,
      type: type,
      timestamp: new Date()
    }

    window.postMessage({ message: "log_message", log: log})
  }

  info(message: string, prefix?: boolean): void {
    const formattedMessage = prefix ? formatString("INFO: %s", message) : message;
    return this.message("info", formattedMessage)
  }

  error(message: string, type?: TLogType, prefix?: boolean): void {
    const formattedMessage = prefix ? formatString("ERROR: %s", message) : message;
    return this.message("error", formattedMessage, type)
  }

  warning(message: string, type?: TLogType, prefix?: boolean): void {
    const formattedMessage = prefix ? formatString("WARNING: %s", message) : message;
    return this.message("warning", formattedMessage, type)
  }
}

const log = new Log()

export {
  log
}