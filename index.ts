import { Client, Collection, Message, TextChannel } from "discord.js";
import dotenv from "dotenv";
import { readdir } from "fs";
import config from "./config";
import { MongoClient } from "mongodb";
const { token, dbUri } = require("./token.json");

const dbClient = new MongoClient(dbUri);

try {
  await dbClient.connect();
} catch (e) {
  console.error(e);
}

export interface runEvent {
  message: Message;
  client: Client;
  args: string[];
  dev: boolean;
}

dotenv.config();

const dev = process.env.NODE_ENV === "dev",
  client = new Client(),
  commands: Collection<string[], (event: runEvent) => any> = new Collection();

readdir("./commands/", (err, allFiles) => {
  if (err) console.log(err);
  let files = allFiles.filter((f) => f.split(".").pop() === "js");
  if (files.length <= 0) console.log("No commands found!");
  else
    for (let file of files) {
      const props = require(`./commands/${file}`) as {
        names: string[];
        run: (event: runEvent) => any;
      };
      commands.set(props.names, props.run);
    }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("message", async (message) => {
  if (
    message.channel.type === "dm" ||
    message.author.bot ||
    !message.content.startsWith(config.prefix)
  )
    return;
  message.member = await message.guild.fetchMember(message.author);

  const args = message.content.split(/ +/);
  if (args.length < 1) return;
  const command = args.shift()!.toLowerCase().slice(config.prefix.length);
  const commandFile = commands.find((r, n) => n.includes(command));
  if (!commandFile) return;
  else
    commandFile({
      message,
      args,
      client,
      dev,
    });
});

if (dev) {
  client.on("debug", (e) => {
    console.log(e);
  });
}

client.on(
  "raw",
  (packet: {
    t: string;
    d: {
      channel_id: string;
      message_id: string;
      emoji: { id: string; name: string };
      user_id: string;
    };
  }) => {
    if (!["MESSAGE_REACTION_ADD", "MESSAGE_REACTION_REMOVE"].includes(packet.t))
      return;
    const channel = client.channels.get(packet.d.channel_id) as TextChannel;
    if (channel.messages.has(packet.d.message_id)) return;
    channel.fetchMessage(packet.d.message_id).then((message) => {
      const emoji = packet.d.emoji.id
        ? `${packet.d.emoji.name}:${packet.d.emoji.id}`
        : packet.d.emoji.name;
      const reaction = message.reactions.get(emoji);
      if (reaction)
        reaction.users.set(
          packet.d.user_id,
          client.users.get(packet.d.user_id)!
        );
      if (packet.t === "MESSAGE_REACTION_ADD") {
        client.emit(
          "messageReactionAdd",
          reaction,
          client.users.get(packet.d.user_id)
        );
      }
      if (packet.t === "MESSAGE_REACTION_REMOVE") {
        client.emit(
          "messageReactionRemove",
          reaction,
          client.users.get(packet.d.user_id)
        );
      }
    });
  }
);

if (token) client.login(token);
else {
  console.log(
    "Create a file called token.json and add a property with your bot's token in there."
  );
  process.exit(1);
}
