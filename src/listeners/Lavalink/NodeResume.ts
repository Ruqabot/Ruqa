import type { Node } from "vulkava";
import PlayerEvent from "../../structures/PlayerEvent";
import Logger from "../../utils/Logger";

export default new PlayerEvent("nodeResume", (node: Node) => {
  Logger.info(`${node.identifier} was been resumed.`);
});
