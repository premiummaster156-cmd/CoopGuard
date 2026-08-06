const config = require("../config");
const logger = require("../utils/logger");
const { info } = require("../utils/embed");
const { logAction } = require("../utils/modlog");

async function handleGuildMemberAdd(client, member) {
  try {
    // Auto-assign member role if configured
    if (config.memberRoleId) {
      const role = member.guild.roles.cache.get(config.memberRoleId);
      if (role) await member.roles.add(role).catch(() => {});
    }
    // Welcome message if configured
    const settings = require("../utils/store").getSettings(member.guild.id);
    if (settings.welcomeChannel) {
      const channel = member.guild.channels.cache.get(settings.welcomeChannel);
      if (channel) {
        await channel.send({ embeds: [info("Welcome!", `Welcome to **${member.guild.name}**, ${member}! 🎉 We now have **${member.guild.memberCount}** members.`)] }).catch(() => {});
      }
    }
    await logAction(member.guild, "Member Joined", [{ name: "User", value: member.user.tag, inline: true }, { name: "ID", value: member.id, inline: true }]);
  } catch (err) {
    logger.error("Member add handler error:", err);
  }
}

async function handleGuildMemberRemove(client, member) {
  try {
    await logAction(member.guild, "Member Left", [{ name: "User", value: member.user.tag, inline: true }, { name: "ID", value: member.id, inline: true }]);
  } catch (err) {
    logger.error("Member remove handler error:", err);
  }
}

module.exports = { handleGuildMemberAdd, handleGuildMemberRemove };
