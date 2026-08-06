const { PermissionFlagsBits } = require("discord.js");
const config = require("../config");
const store = require("./store");
const { logAction } = require("./modlog");
const { error } = require("./embed");

// Shared helpers for moderation actions used by both slash & prefix commands.

async function ensureTarget(interactionOrMessage, userId) {
  const guild = interactionOrMessage.guild;
  const member = guild.members.cache.get(userId) || (await guild.members.fetch(userId).catch(() => null));
  return member;
}

function canInteract(actor, target) {
  if (!target) return { ok: false, reason: "Target user not found." };
  if (actor.id === target.id) return { ok: false, reason: "You cannot moderate yourself." };
  if (target.roles.highest.position >= actor.roles.highest.position && actor.id !== (actor.guild?.ownerId)) {
    return { ok: false, reason: "You cannot moderate someone with equal or higher role than you." };
  }
  return { ok: true };
}

async function doKick(actor, target, reason) {
  await target.kick(reason);
  await logAction(actor.guild, "Kick", [
    { name: "User", value: target.user.tag, inline: true },
    { name: "Moderator", value: actor.user.tag, inline: true },
    { name: "Reason", value: reason || "No reason provided" },
  ], config.colors.danger);
}

async function doBan(actor, target, reason, days = 0) {
  await target.ban({ reason, deleteMessageSeconds: days * 86400 });
  await logAction(actor.guild, "Ban", [
    { name: "User", value: target.user.tag, inline: true },
    { name: "Moderator", value: actor.user.tag, inline: true },
    { name: "Reason", value: reason || "No reason provided" },
  ], config.colors.danger);
}

module.exports = { ensureTarget, canInteract, doKick, doBan };
