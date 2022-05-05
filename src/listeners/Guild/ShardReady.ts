import Event from "../../structures/Event";
import Logger from "../../utils/Logger";

export default new Event("shardReady", (id: number) => {
  Logger.info(`Shard #${id} is ready.`);
});
