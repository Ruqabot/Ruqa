import { type Client, Constants, type Message } from "eris";
import { promises } from "node:fs";
import { env } from "node:process";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";
import ruqa from "../..";
import { helpCommandLinks } from "../../utils/SetButtons";
import Emojis from "../../jsons/emojis.json";

export default new Command({
    name: "help",
    description: "Shows the help command",
    aliases: ["h", "halp"],
    category: "Info",
    isDisabled: false,

    run: async ({ client, message, args }: {
        client: Client,
        message: Message,
        args: string[],
    }) => {
        if (!args[0]) {
            const embed = new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .setTitle(`${Emojis[0].bubble_tea} My Commands`)
            .setDescription(`Hi! I'm ${client.user.username}. A very simple and easy to use Discord bot.`)
            .setThumbnail(client.user?.avatarURL ?? client.user.defaultAvatarURL)
            .addField(
                `• Music (${(await promises.readdir("dist/commands/Music")).length})`,
                `\`${(await promises.readdir("dist/commands/Music", { withFileTypes: true })).map((x) => x.name.replace(".js", "").toLowerCase()).join(", ")}\``,
            )
            .addField(
                `• Filters (${(await promises.readdir("dist/commands/Filters")).length})`,
                `\`${(await promises.readdir("dist/commands/Filters", { withFileTypes: true })).map((x) => x.name.replace(".js", "").toLowerCase()).join(", ")}\``,
            )
            .addField(
                `• Help (${(await promises.readdir("dist/commands/Info")).length})`,
                `\`${(await promises.readdir("dist/commands/Info", { withFileTypes: true })).map((x) => x.name.replace(".js", "").toLowerCase()).join(", ")}\``,
            )
            .setFooter(`Version: ${env.BOT_VERSION ?? "Unknown"}`);
            await message.channel.createMessage({
                embeds: [embed],
                components: [{
                    type: Constants.ComponentTypes.ACTION_ROW,
                    components: helpCommandLinks,
                }],
            });
        } else {
            const cmd = ruqa.commands?.get(args[0]?.toString());
            if (!cmd) {
                message.channel.createMessage({ content: "Mentioned command not found." });
                return;
            }
            const embed = new RichEmbed()
            .setColor(RichEmbed.embedColor)
            .addField("Name", `\`${(cmd as { name: string }).name}\``, true)
            .addField("Aliases", `\`${(cmd as { aliases: Array<string>}).aliases.map((x: string) => x).join(", ") ?? "None"}\``, true)
            .addField("Category", `\`${(cmd as { category?: string }).category ?? "None"}\``, true)
            .addField("Description", `\`${(cmd as { description?: string }).description ?? "None"}\``, true)
            await message.channel.createMessage({ embeds: [embed] });
        }
    },
});
