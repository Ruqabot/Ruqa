import type { Client, Message } from "eris";
import buildMsg from "../../functions/BuildMsg";
import ListenmoePlayer from "../../libs/ListenmoePlayer";
import Command from "../../structures/Command";

export default new Command({
  name: "listenmoe",
  description: "Play audio stream from listen.moe",
  aliases: ["lm"],
  category: "Music",
  isDisabled: false,

  run: async ({
    message,
    args,
  }: {
    client: Client;
    message: Message;
    args: string[];
  }) => {
    const genre = args[0];
    if (!genre) {
      await buildMsg(message, "You need to specify a genre.");
      return;
    }
    const moe = new ListenmoePlayer(message);
    if (!["jpop", "kpop"].includes(genre)) {
      await buildMsg(
        message,
        "You need to specify a genre either **jpop** or **kpop**."
      );
      return;
    }
    await moe.connectListenMoe(genre);
    await moe.playListenMoe();
  },
});
