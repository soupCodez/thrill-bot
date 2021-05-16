"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = require("fs");
const config_1 = __importDefault(require("./config"));
const { token } = require("./token.json");
dotenv_1.default.config();
const dev = process.env.NODE_ENV === "dev", client = new discord_js_1.Client(), commands = new discord_js_1.Collection();
fs_1.readdir("./commands/", (err, allFiles) => {
    if (err)
        console.log(err);
    let files = allFiles.filter((f) => f.split(".").pop() === ("js"));
    if (files.length <= 0)
        console.log("No commands found!");
    else
        for (let file of files) {
            const props = require(`./commands/${file}`);
            commands.set(props.names, props.run);
        }
});
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});
client.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.channel.type === "dm" ||
        message.author.bot ||
        !message.content.startsWith(config_1.default.prefix))
        return;
    message.member = yield message.guild.fetchMember(message.author);
    const args = message.content.split(/ +/);
    if (args.length < 1)
        return;
    const command = args.shift().toLowerCase().slice(config_1.default.prefix.length);
    const commandFile = commands.find((r, n) => n.includes(command));
    if (!commandFile)
        return;
    else
        commandFile({
            message,
            args,
            client,
            dev,
        });
}));
if (dev) {
    client.on("debug", (e) => {
        console.log(e);
    });
}
client.on("raw", (packet) => {
    if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
        return;
    const channel = client.channels.get(packet.d.channel_id);
    if (channel.messages.has(packet.d.message_id))
        return;
    channel.fetchMessage(packet.d.message_id).then((message) => {
        const emoji = packet.d.emoji.id
            ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
            : packet.d.emoji.name;
        const reaction = message.reactions.get(emoji);
        if (reaction)
            reaction.users.set(packet.d.user_id, client.users.get(packet.d.user_id));
        if (packet.t === "MESSAGE_REACTION_ADD") {
            client.emit("messageReactionAdd", reaction, client.users.get(packet.d.user_id));
        }
        if (packet.t === "MESSAGE_REACTION_REMOVE") {
            client.emit("messageReactionRemove", reaction, client.users.get(packet.d.user_id));
        }
    });
});
if (token)
    client.login(token);
else {
    console.log("Create a file called token.json and add a property with your bot's token in there.");
    process.exit(1);
}
