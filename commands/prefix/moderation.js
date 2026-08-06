const { PermissionFlagsBits } = require("discord.js");
const config = require("../../../config");
const store = require("../../../utils/store");
const { ensureTarget, canInteract, doKick, doBan } = require("../../../utils/moderation");
const { success, error, warning } = require("../../../utils/embed");
const { logAction } = require("../../../utils/modlog");

function parseDuration(str) {
  const m = str.match(/(\d+)([smhd])/);
  if (!m) return 10 * 60000;
  return parseInt(m[1], 10) * { s: 1000, m: 60000, h: 3600000, d: 86400000 }[m[2]];
}

module.exports = [
  {
    name: "kick",
    aliases: ["k"],
    description: "Kick a member (prefix). Usage: -*-prefix*-kick @user [reason]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.KickMembers)) return message.reply({ embeds: [error("No permission", "You need Kick Members permission.")] });
      const target = message.mentions.members.first();
      if (!target) return message.reply({ embeds: [error("Usage", "Mention a user to kick.")] });
      const check = canInteract(message.member, target);
      if (!check.ok) return message.reply({ embeds: [error("Cannot kick", check.reason)] });
      const reason = args.slice(1).join(" ") || "No reason provided";
      try {
        await doKick(message.member, target, reason);
        await message.channel.send({ embeds: [success("Kicked", `${target.user.tag} was kicked. Reason: ${reason}`)] });
      } catch (err) {
        await message.channel.send({ embeds: [error("Failed", "Could not kick.")] });
      }
    },
  },
  {
    name: "ban",
    aliases: ["b"],
    description: "Ban a member (prefix). Usage: -*-prefix*-ban @user [reason]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.reply({ embeds: [error("No permission", "You need Ban Members permission.")] });
      const target = message.mentions.members.first();
      if (!target) return message.reply({ embeds: [error("Usage", "Mention a user to ban.")] });
      const check = canInteract(message.member, target);
      if (!check.ok) return message.reply({ embeds: [error("Cannot ban", check.reason)] });
      const reason = args.slice(1).join(" ") || "No reason provided";
      try {
        await doBan(message.member, target, reason);
        await message.channel.send({ embeds: [success("Banned", `${target.user.tag} was banned. Reason: ${reason}`)] });
      } catch (err) {
        await message.channel.send({ embeds: [error("Failed", "Could not ban.")] });
      }
    },
  },
  {
    name: "warn",
    aliases: ["w"],
    description: "Warn a member (prefix). Usage: -*-prefix*-warn @user [reason]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply({ embeds: [error("No permission", "You need Moderate Members.")] });
      const target = message.mentions.members.first();
      if (!target) return message.reply({ embeds: [error("Usage", "Mention a user to warn.")] });
      const reason = args.slice(1).join(" ") || "No reason provided";
      store.addWarning(message.guild.id, target.id, reason, message.author.id);
      const count = store.getWarnings(message.guild.id, target.id).length;
      await logAction(message.guild, "Warn", [{ name: "User", value: target.user.tag, inline: true }, { name: "Reason", value: reason }], config.colors.warning);
      await message.channel.send({ embeds: [warning("Warning Issued", `${target.user.tag} warned (total: ${count}). Reason: ${reason}`)] });
    },
  },
  {
    name: "mute",
    description: "Mute a member (prefix). Usage: -*-prefix*-mute @user [10m] [reason]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply({ embeds: [error("No permission", "You need Moderate Members.")] });
      const target = message.mentions.members.first();
      if (!target) return message.reply({ embeds: [error("Usage", "Mention a user to mute.")] });
      const ms = parseDuration(args[1] || "10m");
      const reason = args.slice(2).join(" ") || "No reason provided";
      try {
        await target.timeout(ms, reason);
        store.setMute(message.guild.id, target.id, Date.now() + ms, message.author.id, reason);
        await message.channel.send({ embeds: [success("Muted", `${target.user.tag} muted for ${ms / 60000} min. Reason: ${reason}`)] });
      } catch (err) {
        await message.channel.send({ embeds: [error("Failed", "Could not mute.")] });
      }
    },
  },
  {
    name: "unmute",
    description: "Unmute a member (prefix). Usage: -*-prefix*-unmute @user",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply({ embeds: [error("No permission", "You need Moderate Members.")] });
      const target = message.mentions.members.first();
      if (!target) return message.reply({ embeds: [error("Usage", "Mention a user to unmute.")] });
      try {
        await target.timeout(null);
        store.removeMute(message.guild.id, target.id);
        await message.channel.send({ embeds: [success("Unmuted", `${target.user.tag} was unmuted.`)] });
      } catch (err) {
        await message.channel.send({ embeds: [error("Failed", "Could not unmute.")] });
      }
    },
  },
  {
    name: "warnings",
    aliases: ["warns"],
    description: "Show warnings for a member (prefix). Usage: -*-prefix*-warnings @user",
    async execute(message, args) {
      const target = message.mentions.members.first() || message.member;
      const warns = store.getWarnings(message.guild.id, target.id);
      if (warns.length === 0) return message.channel.send({ embeds: [success("No Warnings", `${target.user.tag} has no warnings.`)] });
      const text = warns.map((w, i) => `**${i + 1}.** ${w.reason} — *${w.date.slice(0, 10)}*`).slice(0, 20).join("\n");
      await message.channel.send({ embeds: [warning(`Warnings for ${target.user.tag}`, text)] });
    },
  },
  {
    name: "clearwarns",
    aliases: ["cw"],
    description: "Clear warnings for a member (prefix). Usage: -*-prefix*-clearwarns @user",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.reply({ embeds: [error("No permission", "You need Moderate Members.")] });
      const target = message.mentions.members.first();
      if (!target) return message.reply({ embeds: [error("Usage", "Mention a user.")] });
      const count = store.clearWarnings(message.guild.id, target.id);
      await message.channel.send({ embeds: [success("Cleared", `Cleared ${count} warnings for ${target.user.tag}.`)] });
    },
  },
  {
    name: "purge",
    aliases: ["clear", "prune"],
    description: "Delete messages (prefix). Usage: -*-prefix*-purge [amount]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.reply({ embeds: [error("No permission", "You need Manage Messages.")] });
      const amount = parseInt(args[0] || "10", 10);
      const safe = Math.min(Math.max(amount, 1), 100);
      await message.delete().catch(() => {});
      await message.channel.bulkDelete(safe, true);
      const m = await message.channel.send({ embeds: [success("Purged", `Deleted ${safe} messages.`)] });
      setTimeout(() => m.delete().catch(() => {}), 3000);
    },
  },
  {
    name: "lock",
    description: "Lock the channel (prefix).",
    async execute(message) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply({ embeds: [error("No permission", "You need Manage Channels.")] });
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: false });
      await message.channel.send({ embeds: [success("Locked", "This channel was locked.")] });
    },
  },
  {
    name: "unlock",
    description: "Unlock the channel (prefix).",
    async execute(message) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply({ embeds: [error("No permission", "You need Manage Channels.")] });
      await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SendMessages: null });
      await message.channel.send({ embeds: [success("Unlocked", "This channel was unlocked.")] });
    },
  },
  {
    name: "slowmode",
    description: "Set slowmode (prefix). Usage: -*-prefix*-slowmode [seconds]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.reply({ embeds: [error("No permission", "You need Manage Channels.")] });
      const secs = parseInt(args[0] || "0", 10);
      await message.channel.setRateLimitPerUser(secs);
      await message.channel.send({ embeds: [success("Slowmode", `Slowmode set to ${secs}s.`)] });
    },
  },
];
