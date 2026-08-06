const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { ensureTarget, canInteract } = require("../../../utils/moderation");
const store = require("../../../utils/store");
const { success, error } = require("../../../utils/embed");
const { logAction } = require("../../../utils/modlog");

function parseDuration(str) {
  if (!str) return 10 * 60000;
  const m = str.match(/(\d+)([smhd])/);
  if (!m) return 10 * 60000;
  const n = parseInt(m[1], 10);
  const mult = { s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2]];
  return n * mult;
}

module.exports = {
  category: "moderation",
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout (mute) a member.")
    .addUserOption((o) => o.setName("user").setDescription("The member to mute").setRequired(true))
    .addStringOption((o) => o.setName("duration").setDescription("Duration, e.g. 10m, 1h, 2d. Default 10m"))
    .addStringOption((o) => o.setName("reason").setDescription("Reason"))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
    const check = canInteract(interaction.member, target);
    if (!check.ok) return interaction.reply({ embeds: [error("Cannot mute", check.reason)], ephemeral: true });
    const ms = parseDuration(interaction.options.getString("duration"));
    const reason = interaction.options.getString("reason") || "No reason provided";
    try {
      await target.timeout(ms, reason);
      const until = Date.now() + ms;
      store.setMute(interaction.guild.id, target.id, until, interaction.user.id, reason);
      await logAction(interaction.guild, "Mute", [
        { name: "User", value: target.user.tag, inline: true },
        { name: "Moderator", value: interaction.user.tag, inline: true },
        { name: "Duration", value: `${Math.round(ms / 60000)} min`, inline: true },
        { name: "Reason", value: reason },
      ]);
      await interaction.reply({ embeds: [success("Muted", `**${target.user.tag}** was muted for ${ms / 60000} minutes.\nReason: ${reason}`)] });
    } catch (err) {
      await interaction.reply({ embeds: [error("Failed", "I could not mute this user.")], ephemeral: true });
    }
  },
};
