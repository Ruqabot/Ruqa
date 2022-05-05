import type { Member, VoiceChannel } from "eris";
import Event from "../../structures/Event";
import ruqa from "../../index";
import RichEmbed from "../../utils/RichEmbed";

export default new Event(
  "voiceChannelLeave",
  async (member: Member, oldChannel: VoiceChannel) => {
    const player = ruqa.audio.players.get(member.guild.id);
    if (!player) {
      return;
    }

    if (ruqa.user.id === member.id) {
      player.destroy();
    }

    if (
      !member.bot &&
      player.voiceChannelId === oldChannel.id &&
      oldChannel.voiceMembers.filter((x) => x.bot).length
    ) {
      player.pause(true);
      const msg = await ruqa.createMessage(player.textChannelId!, {
        embeds: [
          new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .setDescription(
              "All left me alone, I'll take my leave in 10 seconds."
            ),
        ],
      });

      setTimeout(async () => {
        if (
          !member.bot &&
          player.voiceChannelId === oldChannel.id &&
          oldChannel.voiceMembers.filter((x) => !x.bot).length === 0
        ) {
          if (ruqa.cacheMsgID) {
            await ruqa.cacheMsgID.delete();
          } else if (ruqa.cacheNpMsgID) {
            await ruqa.cacheNpMsgID.delete();
          }
          player.destroy();
        }
        player.pause(false);
        await msg.delete();
      }, 10e3);
    }
  }
);
