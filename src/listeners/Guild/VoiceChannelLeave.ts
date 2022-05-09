import { Constants, type Member, type VoiceChannel } from "eris";
import Event from "../../structures/Event";
import ruqa from "../../index";
import { trackStartModifier, nowplayingModifier } from "../../utils/SetButtons";

export default new Event(
  "voiceChannelLeave",
  async (member: Member, oldChannel: VoiceChannel) => {
    const player = ruqa.audio.players.get(member.guild.id);
    if (!player) {
      return;
    }

    if (ruqa.user.id === member.id) {
      if (ruqa.cacheMsgID) {
        await ruqa.cacheMsgID.delete();
      }
      if (ruqa.cacheNpMsgID) {
        await ruqa.cacheNpMsgID.delete();
      }
      if (ruqa.cacheQueueMsg) {
        await ruqa.cacheQueueMsg.delete();
      }
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
