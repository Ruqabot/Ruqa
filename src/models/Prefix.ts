import { Schema, model } from "mongoose";

const schemaSheet = new Schema({
    guildID: String,
    configuredPrefix: String,
});

export default model("Prefix", schemaSheet);
