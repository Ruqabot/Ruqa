import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import notInVC from "../../functions/NotInVC";
import Emojis from "../../jsons/emojis.json";

export default new Command({
  name: "join",
  description: "Connect to a voice channel",
  aliases: ["connect"],
  category: "Music",
  isDisabled: false,

  run: async ({ client, message }: { client: Client; message: Message }) => {
    if (!(await notInVC(message))) {
      return;
    }
    let player = client.audio.players.get(message.guildID!);
    if (!player) {
      player = client.audio.createPlayer({
        guildId: message.guildID!,
        textChannelId: message.channel.id,
        voiceChannelId: message.member?.voiceState.channelID,
        selfDeaf: true,
      });
      player.connect();
      await message.addReaction(Emojis[0].ok_hand);
    } else {
      const restMember = await client.getRESTGuildMember(
        message.guildID!,
        client.user.id
      );
      await buildMsg(
        message,
        `I'm already connected with <#${restMember.voiceState.channelID}>.`
      );
    }
  },
});
