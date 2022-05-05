import Event from "../../structures/Event";
import Logger from "../../utils/Logger";

export default new Event("shardResume", (id: number) => {
  Logger.info(`Shard #${id} was resumed.`);
});
