"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function run(e) {
    let help;
    fs_1.readdir("./commands", (err, allFiles) => {
        if (err)
            console.log(err);
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
exports.run = run;
exports.names = ["help", "?"];
