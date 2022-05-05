import type { Client, Message, TextableChannel } from "eris";
import { env } from "node:process";
import buildMsg from "../../functions/BuildMsg";
import checkPerm from "../../functions/CheckPerm";
import Prefix from "../../models/Prefix";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";

export default new Command({
  name: "resetprefix",
  description: "Reset the prefix for the guild (if any pre configured)",
  aliases: ["rp"],
  category: "Settings",
  isDisabled: false,

  run: async ({ client, message }: { client: Client; message: Message }) => {
    if (
      !(await checkPerm(
        message,
        "You need **Manage Guild** permission to use this command.",
        "manageGuild"
      ))
    ) {
      return;
    }
    Prefix.findOne(
      {
        guildID: message.guildID!,
      },
      async (
        error: unknown,
        data: {
          configuredPrefix?: string;
          delete: () => Promise<void>;
        }
      ) => {
        if (error) {
          const channel = client.getChannel(env.LOGGING_CHANNEL!);
          try {
            await (channel as TextableChannel).createMessage({
              embeds: [
                new RichEmbed()
                  .setColor(RichEmbed.embedColor)
                  .setDescription(
                    `Something went wrong with the database.\n\n${error}`
                  ),
              ],
            });
          } catch {}
        }

        if (data) {
          await data.delete();
          await buildMsg(
            message,
            `Prefix was been reset to default one. (**${
              env.DEFAULT_PREFIX ?? "-"
            }**).`
          );
        } else {
          await buildMsg(
            message,
            "No custom prefix was configured for this server."
          );
        }
      }
    );
  },
});
