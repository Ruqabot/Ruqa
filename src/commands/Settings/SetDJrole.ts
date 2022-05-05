import type { Client, Message, TextableChannel } from "eris";
import { env } from "node:process";
import buildMsg from "../../functions/BuildMsg";
import checkPerm from "../../functions/CheckPerm";
import DJRole from "../../models/DJRole";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";
import { sanitizeRole } from "../../utils/Util";

export default new Command({
  name: "setdjrole",
  description: "Configure a DJ role for your server)",
  aliases: ["dj", "sdj"],
  category: "Settings",
  isDisabled: false,

  run: async ({
    client,
    message,
    args,
  }: {
    client: Client;
    message: Message;
    args: string[];
  }) => {
    if (
      !(await checkPerm(
        message,
        "You need **Manage Guild** permission to use this command.",
        "manageGuild"
      ))
    ) {
      return;
    }
    const roleCode = args[0];
    if (!roleCode) {
      await buildMsg(
        message,
        "You need to provide a new prefix for this server."
      );
      return;
    }
    if (sanitizeRole(roleCode).length > 18) {
      await buildMsg(
        message,
        "Buddy, you can't set any type of value as a role."
      );
      return;
    }
    DJRole.findOne(
      {
        guildID: message.guildID!,
      },
      async (error: unknown) => {
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

        new DJRole({
          guildID: message.guildID!,
          configuredRole: sanitizeRole(roleCode),
        }).save();
        await buildMsg(message, "DJ role was been updated.");
      }
    );
  },
});
