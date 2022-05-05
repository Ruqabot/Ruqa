import { env } from "node:process";

const barSize = 11;
const barText = "▬";
const barSlider = "🔘";

export function buildProgressBar(
  total?: number,
  current?: number
): [string, number] {
  const percentage = current! > total! ? 1 : current! / total!;
  const progress = Math.round(barSize * percentage);
  const emptyProgress = barSize - progress;
  const emptyProgressText = barText.repeat(emptyProgress);
  const progressText =
    progress >= 1
      ? `[${barText.repeat(progress)}](https://discord.gg/${
          env.SUPPORT_SERVER ?? "not_set"
        })${barSlider}`
      : barSlider;
  const bar = `${progressText}${emptyProgressText}`;
  const calculated = percentage * 100;

  return [bar, calculated];
}

export function makeChunk(
  array: Array<string> | string,
  size: number = 1
): Array<string[]> {
  size = Math.max(Number(size), 0);
  const length = !array ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  let index = 0;
  let resIndex = 0;
  const result = new Array(Math.ceil(length / size));
  while (index < length) {
    result[resIndex++] = array.slice(index, (index += size));
  }
  return result;
}

export function sanitizeRole(role: string): string {
  return role.replaceAll("<@&", "").replaceAll(">", "");
}

export function sanitizeMention(mention: string): string {
  return mention.replaceAll("<@", "").replaceAll("<@!", "").replaceAll(">", "");
}

export function sanitizeCode(code: string): string {
  return code.replaceAll("```js\n", "").replaceAll("\n```", "");
}
