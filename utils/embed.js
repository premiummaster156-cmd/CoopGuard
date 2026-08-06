const { EmbedBuilder } = require("discord.js");
const config = require("../config");

function base(title = null, description = null, color = config.colors.primary) {
  const embed = new EmbedBuilder().setColor(color).setTimestamp();
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  return embed;
}

function success(title, description) {
  return base(title, description, config.colors.success).setFooter({ text: "CoopGuard ✓" });
}

function error(title, description) {
  return base(title, description, config.colors.danger).setFooter({ text: "CoopGuard ✗" });
}

function warning(title, description) {
  return base(title, description, config.colors.warning).setFooter({ text: "CoopGuard !" });
}

function info(title, description) {
  return base(title, description, config.colors.info).setFooter({ text: "CoopGuard i" });
}

module.exports = { base, success, error, warning, info };
