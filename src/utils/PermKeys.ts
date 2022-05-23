const permKeys = (key: string) => {
  switch (key) {
    case "sendMessages":
      return "Send Messages";
    case "attachFiles":
      return "Attach Files";
    case "readMessageHistory":
      return "Read Message History";
    case "useExternalEmojis":
      return "Use External Emojis";
    case "voiceSpeak":
      return "Voice Speak";
    case "voiceConnect":
      return "Voice Connect";
    case "voiceMuteMembers":
      return "Voice Deafen Members";
    case "voiceDeafenMembers":
      return "Voice Deafen Members";
    case "voiceRequestToSpeak":
      return "Voice RequestToSpeak";
    default:
      throw new Error("Unreferenced permission key");
  }
};

export default permKeys;
