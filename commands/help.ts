import { runEvent } from "../index";
import { readdir } from "fs";

export function run(e: runEvent) {
  let help: string;
  readdir("./commands", (err, allFiles) => {
    if (err) console.log(err);
    let files = allFiles.filter((f) => f.split(".").pop() === "js");

    help = help + files.toString();
    for (let file in files) {
      help = help.replace(".js", "");
      help = help.replace(",", ", ");
    }
    help = help.replace("undefined", "");
    e.message.reply(`You can use commands: ${help}`);
  });
}

export const names = ["help", "?"];
