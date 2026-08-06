const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ensureTarget } = require("../../../utils/moderation");
const store = require("../../../utils/store");
const { success, error } = require("../../../utils/embed");
const { logAction } = require("../../../utils/modlog");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Remove a timeout from a member.")
    .addUserOption((o) => o.setName("user").setDescription("The member to unmute").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
    if (!target) return interaction.reply({ embeds: [error("Cannot unmute", "User not found.")], ephemeral: true });
    try {
      await target.timeout(null);
      store.removeMute(interaction.guild.id, target.id);
      await logAction(interaction.guild, "Unmute", [
        { name: "User", value: target.user.tag, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
      ], 0x22c55e);
      await interaction.reply({ embeds: [success("Unmuted", `**${target.user.tag}** was unmuted.`)] });
    } catch (err) {
      await interaction.reply({ embeds: [error("Failed", "I could not unmute this user.")], ephemeral: true });
    }
  },
};
