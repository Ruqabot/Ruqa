import type { CommandOptions } from "../interfaces/CommandOptions";

export default class Command {
    constructor(commandOptions: CommandOptions) {
        Object.assign(this, commandOptions);
    }
}
