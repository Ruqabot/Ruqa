import Event from "../../structures/Event";
import Logger from "../../utils/Logger";

export default new Event("shardDisconnect", (error?: Error, id?: number) => {
  Logger.error(
    `Shard #${id} was disconnected. Message: ${
      error?.message ?? "No message(s) found."
    }`
  );
});
