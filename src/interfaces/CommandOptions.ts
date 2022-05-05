export interface CommandOptions {
    name: string,
    description?: string,
    aliases?: Array<string>,
    category?: string,
    isDisabled?: boolean,
    run: Function,
}
