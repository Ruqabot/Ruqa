import type { Message } from "eris";
import { inspect } from "node:util";
import buildMsg from "../../functions/BuildMsg";
import Command from "../../structures/Command";
import { sanitizeCode } from "../../utils/Util";
import owners from "../../jsons/owners.json";

export default new Command({
  name: "eval",
  description: "Evalutes some JavaScript code",
  aliases: ["ev"],
  category: "Owner",
  isDisabled: false,

  run: async ({ message, args }: { message: Message; args: string[] }) => {
    if (!owners.ownersIDs.includes(message.author.id)) {
      return;
    }
    const code = args.join(" ");
    if (!code) {
      await buildMsg(
        message,
        "You need to provide some code. Don't abuse else ghost will take you."
      );
      return;
    }
    if (!code.startsWith("```js\n") || !code.endsWith("\n```")) {
      await buildMsg(
        message,
        "Code must be inside JavaScript code blocks with new line."
      );
      return;
    }
    try {
      // eslint-disable-next-line no-eval
      const evaluted = eval(sanitizeCode(code));
      inspect(evaluted, { depth: 0 });
    } catch {}
  },
});
