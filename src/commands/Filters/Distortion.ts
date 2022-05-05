import type { Client, Message } from "eris";
import Command from "../../structures/Command";
import buildMsg from "../../functions/BuildMsg";
import configuredDJRole from "../../functions/ConfiguredDJRole";
import isPlayerActive from "../../functions/IsPlayerActive";
import notInSameVC from "../../functions/NotInSameVC";
import notInVC from "../../functions/NotInVC";
import playerHasFilters from "../../functions/PlayerHasFilters";
import hasPremium from "../../functions/HasPremium";

export default new Command({
  name: "distortion",
  description: "Enable/disable distortion audio filter",
  aliases: [],
  category: "Filters",
  isDisabled: false,

  run: async function ({ message }: { client: Client; message: Message }) {
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

    if (player?.filters.active?.distortion) {
      player.filters.clear();
      await buildMsg(message, "Disabled distortion filter.");
    } else {
      // eslint-disable-next-line no-unused-expressions
      playerHasFilters(player!);
      player?.filters.setDistortion(
        {
          sinOffset: 0.0,
          sinScale: 1.0,
          cosOffset: 0.0,
          cosScale: 1.0,
          tanOffset: 0.0,
          tanScale: 1.0,
          offset: 0.0,
          scale: 1.0,
        },
        true
      );
      await buildMsg(message, "Enabled distortion filter.");
    }
  },
});
