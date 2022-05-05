import type { Player } from "vulkava";

export default function playerHasFilters(player: Player): void {
    // eslint-disable-next-line no-unused-expressions
    Object.keys(player?.filters.active!).length > 0
    ? player?.filters.clear()
    : undefined;
}
