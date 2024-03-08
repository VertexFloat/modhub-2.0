export type TLogLevel = "info" | "warning" | "error"
export type TLogType = "internal" | "external"
export interface ILog {
  level: TLogLevel;
  type?: TLogType;
  message: string;
  timestamp: Date;
}