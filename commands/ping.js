"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.names = exports.run = void 0;
function run(e) {
    e.message.reply(`Pong! Current ping is ${Math.round(e.client.ping)}`);
}
exports.run = run;
exports.names = ["ping", "delay", "ms", "pong"];
