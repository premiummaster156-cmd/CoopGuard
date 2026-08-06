const { EmbedBuilder } = require("discord.js");
const config = require("../config");

// Posts moderation actions to the configured log channel.
async function logAction(guild, action, fields, color = config.colors.info) {
  if (!config.logChannelId) return;
  const channel = guild.channels.cache.get(config.logChannelId);
  if (!channel) return;
  const embed = new EmbedBuilder()
    .setTitle(action)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: "CoopGuard ModLog" });
  for (const f of fields) {
    embed.addFields({ name: f.name, value: String(f.value), inline: f.inline ?? false });
  }
  try {
    await channel.send({ embeds: [embed] });
  } catch (err) {
    // ignore
  }
}

module.exports = { logAction };
