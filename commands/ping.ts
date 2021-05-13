import { runEvent } from "../index";

export function run(e: runEvent) {
  e.message.reply(`Pong! Current ping is ${Math.round(e.client.ping)}`);
}

export const names = ["ping", "delay", "ms", "pong"];
