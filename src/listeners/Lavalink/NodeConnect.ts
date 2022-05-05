import type { Node } from "vulkava";
import PlayerEvent from "../../structures/PlayerEvent";
import Logger from "../../utils/Logger";

export default new PlayerEvent("nodeConnect", (node: Node) => {
    Logger.success(`${node.identifier} was been connected.`);
});
