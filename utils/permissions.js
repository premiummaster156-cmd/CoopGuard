const { PermissionFlagsBits } = require("discord.js");
const config = require("../config");

const PERMISSION_LABELS = {
  [PermissionFlagsBits.Administrator]: "Administrator",
  [PermissionFlagsBits.ManageGuild]: "Manage Server",
  [PermissionFlagsBits.ManageRoles]: "Manage Roles",
  [PermissionFlagsBits.ManageChannels]: "Manage Channels",
  [PermissionFlagsBits.ManageMessages]: "Manage Messages",
  [PermissionFlagsBits.ManageWebhooks]: "Manage Webhooks",
  [PermissionFlagsBits.ManageNicknames]: "Manage Nicknames",
  [PermissionFlagsBits.KickMembers]: "Kick Members",
  [PermissionFlagsBits.BanMembers]: "Ban Members",
  [PermissionFlagsBits.ModerateMembers]: "Timeout Members",
  [PermissionFlagsBits.MuteMembers]: "Mute Members",
  [PermissionFlagsBits.ViewChannel]: "View Channels",
  [PermissionFlagsBits.SendMessages]: "Send Messages",
  [PermissionFlagsBits.EmbedLinks]: "Embed Links",
  [PermissionFlagsBits.AttachFiles]: "Attach Files",
};

function hasPerm(member, perm) {
  return member.permissions.has(perm);
}

function isAdmin(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

function isModerator(member) {
  return (
    isAdmin(member) ||
    member.permissions.has(PermissionFlagsBits.KickMembers) ||
    member.permissions.has(PermissionFlagsBits.BanMembers) ||
    member.permissions.has(PermissionFlagsBits.ModerateMembers)
  );
}

function isOwner(userId) {
  return config.ownerIds.includes(userId);
}

function canModerate(member, target) {
  if (isOwner(member.id)) return true;
  if (!isModerator(member)) return false;
  if (!target) return true;
  return member.roles.highest.position > target.roles.highest.position;
}

function missingPerms(member, perms) {
  const missing = [];
  for (const perm of perms) {
    if (!hasPerm(member, perm)) missing.push(PERMISSION_LABELS[perm] || String(perm));
  }
  return missing;
}

module.exports = { hasPerm, isAdmin, isModerator, isOwner, canModerate, missingPerms, PERMISSION_LABELS };
