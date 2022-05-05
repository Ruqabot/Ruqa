import { stdout } from "process";

export default class Logger {
  public static info(msg: string): void {
    stdout.write(`\x1b[97m${msg}\x1b[0m\n`);
  }

  public static warn(msg: string): void {
    stdout.write(`\x1b[93m${msg}\x1b[0m\n`);
  }

  public static error(msg: string): void {
    stdout.write(`\x1b[91m${msg}\x1b[0m\n`);
  }

  public static success(msg: string): void {
    stdout.write(`\x1b[92m${msg}\x1b[0m\n`);
  }
}
