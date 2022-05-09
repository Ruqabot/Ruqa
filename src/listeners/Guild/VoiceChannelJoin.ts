import { Constants, type Member, type VoiceChannel } from "eris";
import Event from "../../structures/Event";
import ruqa from "../../index";
import { trackStartButtons, nowplayingButtons } from "../../utils/SetButtons";

export default new Event(
  "voiceChannelJoin",
  async (member: Member, newChannel: VoiceChannel) => {
    const player = ruqa.audio.players.get(member.guild.id);
    if (!player) {
      return;
    }
    if (
      !member.bot &&
      player.voiceChannelId === newChannel.id &&
      newChannel.voiceMembers.filter((x) => x.bot).length
    ) {
      if (!player.paused) {
        return;
      }
      player.pause(false);
      if (ruqa.cacheMsgID) {
        ruqa.cacheMsgID.edit({
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: trackStartButtons,
            },
          ],
        });
      }
      if (ruqa.cacheNpMsgID) {
        ruqa.cacheNpMsgID.edit({
          components: [
            {
              type: Constants.ComponentTypes.ACTION_ROW,
              components: nowplayingButtons,
            },
          ],
        });
      }
    }
  }
);
