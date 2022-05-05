import type { ClientEvents } from "eris";

export default class Event<Key extends keyof ClientEvents> {
    // eslint-disable-next-line no-useless-constructor
    public constructor(
        public event: Key,
        public run: (...args: ClientEvents[Key]) => any,
    // eslint-disable-next-line no-empty-function
    ) {}
}
