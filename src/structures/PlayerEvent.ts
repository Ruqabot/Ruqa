import type { PlayerEventTypes } from "vulkava/lib/@types";

export default class PlayerEvent<Key extends keyof PlayerEventTypes> {
    // eslint-disable-next-line no-useless-constructor
    public constructor(
        public event: Key,
        public run: (...args: PlayerEventTypes[Key]) => any,
    // eslint-disable-next-line no-empty-function
    ) {}
}
