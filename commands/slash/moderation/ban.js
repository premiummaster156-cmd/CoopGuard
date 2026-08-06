const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { canInteract, ensureTarget, doBan } = require("../../../utils/moderation");
const { success, error } = require("../../../utils/embed");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server.")
    .addUserOption((o) => o.setName("user").setDescription("The member to ban").setRequired(true))
    .addStringOption((o) => o.setName("reason").setDescription("Reason for the ban"))
    .addIntegerOption((o) => o.setName("days").setDescription("Days of messages to delete (0-7)"))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
    const check = canInteract(interaction.member, target);
    if (!check.ok) return interaction.reply({ embeds: [error("Cannot ban", check.reason)], ephemeral: true });
    const reason = interaction.options.getString("reason") || "No reason provided";
    const days = interaction.options.getInteger("days") || 0;
    try {
      await doBan(interaction.member, target, reason, days);
      await interaction.reply({ embeds: [success("Banned", `**${target.user.tag}** was banned.\nReason: ${reason}`)] });
    } catch (err) {
      await interaction.reply({ embeds: [error("Failed", "I could not ban this user. Check my permissions.")], ephemeral: true });
    }
  },
};
