import { Constants, type Member, type VoiceChannel } from "eris";
import Event from "../../structures/Event";
import ruqa from "../../index";
import RichEmbed from "../../utils/RichEmbed";
import { trackStartModifier, nowplayingModifier } from "../../utils/SetButtons";

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
      if (player.paused) {
        return;
      }
      player.pause(true);
      ruqa.cacheLeaveMsg = await ruqa.createMessage(player.textChannelId!, {
        embeds: [
          new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .setDescription("All left me alone, I'll pause the player."),
        ],
      });

      if (ruqa.cacheMsgID) {
        ruqa.cacheMsgID.edit({
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: trackStartModifier,
            },
          ],
        });
      }
      if (ruqa.cacheNpMsgID) {
        ruqa.cacheNpMsgID.edit({
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: nowplayingModifier,
            },
          ],
        });
      }
    }
  }
);
