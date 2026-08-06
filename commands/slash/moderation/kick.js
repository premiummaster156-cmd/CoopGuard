const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { canInteract, ensureTarget, doKick } = require("../../../utils/moderation");
const { success, error } = require("../../../utils/embed");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .addUserOption((o) => o.setName("user").setDescription("The member to kick").setRequired(true))
    .addStringOption((o) => o.setName("reason").setDescription("Reason for the kick"))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
    const check = canInteract(interaction.member, target);
    if (!check.ok) return interaction.reply({ embeds: [error("Cannot kick", check.reason)], ephemeral: true });
    const reason = interaction.options.getString("reason") || "No reason provided";
    try {
      await doKick(interaction.member, target, reason);
      await interaction.reply({ embeds: [success("Kicked", `**${target.user.tag}** was kicked.\nReason: ${reason}`)] });
    } catch (err) {
      await interaction.reply({ embeds: [error("Failed", "I could not kick this user. Check my permissions.")], ephemeral: true });
    }
  },
};
