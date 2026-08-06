const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ensureTarget, canInteract } = require("../../../utils/moderation");
const store = require("../../../utils/store");
const { success, error, warning } = require("../../../utils/embed");
const { logAction } = require("../../../utils/modlog");
const config = require("../../../config");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member.")
    .addUserOption((o) => o.setName("user").setDescription("The member to warn").setRequired(true))
    .addStringOption((o) => o.setName("reason").setDescription("Reason for the warning"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
    const check = canInteract(interaction.member, target);
    if (!check.ok) return interaction.reply({ embeds: [error("Cannot warn", check.reason)], ephemeral: true });
    const reason = interaction.options.getString("reason") || "No reason provided";
    const warn = store.addWarning(interaction.guild.id, target.id, reason, interaction.user.id);
    const count = store.getWarnings(interaction.guild.id, target.id).length;

    // Auto-mute after threshold
    if (config.warnAutoMuteLimit > 0 && count >= config.warnAutoMuteLimit) {
      const until = Date.now() + 10 * 60000;
      try {
        await target.timeout(10 * 60000, "Auto-mute: reached warn limit");
        store.setMute(interaction.guild.id, target.id, until, interaction.user.id, "Auto-mute from warnings");
        await logAction(interaction.guild, "Auto-Mute", [
          { name: "User", value: target.user.tag, inline: true },
          { name: "Warnings", value: String(count), inline: true },
        ], config.colors.warning);
      } catch (err) { /* ignore */ }
    }

    await logAction(interaction.guild, "Warn", [
      { name: "User", value: target.user.tag, inline: true },
      { name: "Moderator", value: interaction.user.tag, inline: true },
      { name: "Reason", value: reason },
    ], config.colors.warning);

    await interaction.reply({ embeds: [warning("Warning Issued", `**${target.user.tag}** has been warned (warning **#${warn.id}**).\nReason: ${reason}\nTotal warnings: **${count}**`)] });
  },
};
