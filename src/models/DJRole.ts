import { Schema, model } from "mongoose";

const schemaSheet = new Schema({
  guildID: String,
  configuredRole: String,
});

export default model("DJRole", schemaSheet);
