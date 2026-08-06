const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const store = require("../../../utils/store");
const { error } = require("../../../utils/embed");
const config = require("../../../config");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("List all warnings for a member.")
    .addUserOption((o) => o.setName("user").setDescription("The member to check").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const warnings = store.getWarnings(interaction.guild.id, user.id);
    if (warnings.length === 0) {
      return interaction.reply({ embeds: [error("No Warnings", `**${user.tag}** has no warnings. ✅`)] });
    }
    const embed = new EmbedBuilder()
      .setTitle(`Warnings for ${user.tag}`)
      .setColor(config.colors.warning)
      .setDescription(`Total: **${warnings.length}**`)
      .setTimestamp();
    warnings.slice(0, 20).forEach((w) => {
      const mod = interaction.guild.members.cache.get(w.modId)?.user.tag || "Unknown";
      embed.addFields({ name: `#${w.id}`, value: `**Reason:** ${w.reason}\n**By:** ${mod}\n**Date:** ${new Date(w.date).toLocaleDateString()}` });
    });
    await interaction.reply({ embeds: [embed] });
  },
};
