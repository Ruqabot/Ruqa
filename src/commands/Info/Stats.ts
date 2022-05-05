import { type Client, type Message, VERSION, Constants } from "eris";
import { uptime, memoryUsage, version } from "node:process";
import prettyMs from "pretty-ms";
import Command from "../../structures/Command";
import RichEmbed from "../../utils/RichEmbed";
import { helpCommandLinks } from "../../utils/SetButtons" 

export default new Command({
    name: "stats",
    description: "Show the status of the bot",
    aliases: ["status"],
    category: "Info",
    isDisabled: false,

    run: async ({ client, message }: {
        client: Client,
        message: Message,
    }) => {
        const embed = new RichEmbed()
        .setColor(RichEmbed.embedColor)
        .setTitle(`${client.user.username}`)
        .setURL(`https://top.gg/bot/${client.user.id}`)
        .setDescription(`Hi! I'm ${client.user.username}, a Discord bot who can play music on voice channel from various sources.`)
        .addField("Status", `
        • **Uptime:** ${prettyMs(uptime(), { verbose: true })}
        • **Servers:** ${client.guilds.size}
        • **Shards:** ${client.shards.size} (active)
        • **Heap Usage:** ${(memoryUsage().rss / 1000 / 1000).toFixed(2)} MiB
        • **Library:** Eris v${VERSION}
        • **Interpreter:** Node.js ${version}
        `);

        await message.channel.createMessage({
            embeds: [embed],
            components: [{
                type: Constants.ComponentTypes.ACTION_ROW,
                components: helpCommandLinks
            }],
        });
    },
});
