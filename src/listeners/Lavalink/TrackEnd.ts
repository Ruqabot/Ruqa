import ruqa from "../../index";
import PlayerEvent from "../../structures/PlayerEvent";

export default new PlayerEvent("trackEnd", async () => {
  await ruqa.cacheMsgID.delete();
  if (ruqa.cacheNpMsgID) {
    await ruqa.cacheNpMsgID.delete();
  }
});
