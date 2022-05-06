import type { Client, Message } from "eris";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";
import hasPremium from "../../functions/HasPremium";
import Emojis from "../../jsons/emojis.json";

export default new Command({
  name: "related",
  description: "Automatically add related tracks from current one",
  aliases: ["rel"],
  category: "Music",
  isDisabled: false,

  run: async ({ client, message }: { client: Client; message: Message }) => {
    if (!(await hasPremium(message, message.author.id))) {
      return;
    }
    if (
      !(await notInVC(message)) ||
      !(await notInSameVC(message)) ||
      !(await configuredDJRole(message))
    ) {
      return;
    }

    const [player, ret] = await isPlayerActive(message);
    if (!ret) {
      return;
    }

    let msg: Message;
    const currentVidID = player?.current?.identifier;
    const reactedCache = (await message.addReaction(
      Emojis[0].flowing_sand
    )) as unknown as Message;

    const res = await client.audio.search(
      `https://www.youtube.com/watch?v=${currentVidID}&list=RD${currentVidID}&start_radio=1`
    );
    if (res.loadType !== "PLAYLIST_LOADED") {
      await buildMsg(message, "There are no tracks found.");
    } else {
      msg = await message.channel.createMessage({
        embeds: [
          new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .setDescription(
              `${
                Emojis[0].audio
              } Loading playlist ${res.playlistInfo?.name?.replaceAll(
                "||",
                ""
              )}`
            ),
        ],
      });
      res.tracks.forEach((track) => {
        track.setRequester(message.author);
        player?.queue.push(track);
      });
      await msg.edit({
        embeds: [
          new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .setDescription(
              `${Emojis[0].audio} Added ${res.playlistInfo?.name?.replaceAll(
                "||",
                ""
              )}`
            ),
        ],
      });
      await reactedCache.removeReactions();
    }
  },
});
