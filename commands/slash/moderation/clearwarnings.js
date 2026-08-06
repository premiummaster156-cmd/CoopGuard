const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const store = require("../../../utils/store");
const { success, error } = require("../../../utils/embed");

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("clearwarnings")
    .setDescription("Clear all warnings for a member.")
    .addUserOption((o) => o.setName("user").setDescription("The member").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const count = store.clearWarnings(interaction.guild.id, user.id);
    await interaction.reply({ embeds: [success("Warnings Cleared", `Cleared **${count}** warning(s) for **${user.tag}**.`)] });
  },
};
