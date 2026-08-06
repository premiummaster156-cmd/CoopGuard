const config = require("../config");
const logger = require("../utils/logger");
const { error } = require("../utils/embed");

async function handleMessage(client, message) {
  if (message.author.bot) return;
  if (message.channel.type === 1) return; // DM ignore

  // Prefix command handling
  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const cmdName = args.shift().toLowerCase();
  const command = client.prefixCommands.get(cmdName) || client.prefixCommands.get(client.prefixAliases.get(cmdName));

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (err) {
    logger.error(`Error in prefix command ${cmdName}:`, err);
    message.reply({ embeds: [error("Command Error", "Something went wrong.\n```\n" + (err.message || "Unknown error") + "\n```")] }).catch(() => {});
  }
}

module.exports = { handleMessage };
