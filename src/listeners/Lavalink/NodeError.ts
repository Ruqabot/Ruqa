import type { Node } from "vulkava";
import PlayerEvent from "../../structures/PlayerEvent";
import Logger from "../../utils/Logger";

export default new PlayerEvent("error", (node: Node, error: Error) => {
    Logger.error(`${node.identifier} was been run into an error.\nCaused by: ${error?.cause ?? "Unknown"}\nMessage: ${error?.message ?? "Unknown"}`);
});
