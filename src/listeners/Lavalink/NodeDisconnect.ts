import type { Node } from "vulkava";
import PlayerEvent from "../../structures/PlayerEvent";
import Logger from "../../utils/Logger";

export default new PlayerEvent("nodeDisconnect", (node: Node) => {
  Logger.error(`${node.identifier} was been disconnected.`);
});
