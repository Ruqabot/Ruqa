import { Constants } from "eris";
import { env } from "node:process";
import Event from "../../structures/Event";
import Logger from "../../utils/Logger";
import ruqa from "../../index";

export default new Event("ready", () => {
  Logger.success(`[Logged In] as ${ruqa.user.username} in ${ruqa.guilds.size}`);
  ruqa.editStatus({
    name: `${env.DEFAULT_PREFIX ?? "-"}help`,
    type: Constants.ActivityTypes.GAME,
  });
  ruqa.audio.start(ruqa.user.id);
});
