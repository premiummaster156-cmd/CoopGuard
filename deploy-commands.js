const { REST, Routes } = require("discord.js");
const config = require("./config");
const logger = require("./utils/logger");
const { loadSlashCommands, walk } = require("./loaders");
const fs = require("fs");
const path = require("path");

// Build a fresh client-less collection of slash command data
const commands = [];
const dir = path.join(__dirname, "commands", "slash");
for (const file of walk(dir)) {
  const cmd = require(file);
  if (cmd && cmd.data) commands.push(cmd.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    logger.info(`Registering ${commands.length} slash commands...`);
    if (config.devGuildId) {
      await rest.put(Routes.applicationGuildCommands(config.clientId, config.devGuildId), { body: commands });
      logger.success(`Registered ${commands.length} commands to guild ${config.devGuildId}`);
    } else {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
      logger.success(`Registered ${commands.length} global commands (may take up to 1h to propagate)`);
    }
  } catch (err) {
    logger.error("Failed to register commands:", err);
  }
})();
