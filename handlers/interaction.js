const { Events } = require("discord.js");
const logger = require("../utils/logger");
const { success, error } = require("../utils/embed");

async function handleInteraction(client, interaction) {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd) {
        return interaction.reply({ embeds: [error("Unknown command", "This command is not registered.")], ephemeral: true });
      }
      try {
        await cmd.execute(interaction, client);
      } catch (err) {
        logger.error(`Error in slash command /${interaction.commandName}:`, err);
        const reply = { embeds: [error("Command Error", "Something went wrong while running this command.\n```\n" + (err.message || "Unknown error") + "\n```")], ephemeral: true };
        if (interaction.replied || interaction.deferred) await interaction.editReply(reply).catch(() => {});
        else await interaction.reply(reply).catch(() => {});
      }
      return;
    }

    if (interaction.isButton()) {
      const handler = client.slashCommands.get(interaction.message.interaction?.commandName);
      if (handler && handler.button) return handler.button(interaction, client);
      return interaction.reply({ content: "No button handler.", ephemeral: true });
    }

    if (interaction.isStringSelectMenu()) {
      const handler = client.slashCommands.get(interaction.message.interaction?.commandName);
      if (handler && handler.select) return handler.select(interaction, client);
      return interaction.reply({ content: "No select menu handler.", ephemeral: true });
    }

    if (interaction.isModalSubmit()) {
      const handler = client.slashCommands.get(interaction.customId.split(":")[0]);
      if (handler && handler.modal) return handler.modal(interaction, client);
      return interaction.reply({ content: "No modal handler.", ephemeral: true });
    }
  } catch (err) {
    logger.error("Interaction error:", err);
  }
}

module.exports = { handleInteraction };
