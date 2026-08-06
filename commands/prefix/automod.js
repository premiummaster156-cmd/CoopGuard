const { PermissionFlagsBits } = require("discord.js");
const store = require("../../../utils/store");
const { success, error, info } = require("../../../utils/embed");

module.exports = [
  {
    name: "automod",
    aliases: ["am"],
    description: "View automod settings (prefix).",
    async execute(message) {
      const s = store.getSettings(message.guild.id);
      const text = Object.entries({ profanity: "Profanity", antispam: "Anti-spam", links: "Link filter", mentionSpam: "Mention spam", invites: "Invite filter", caps: "Caps filter" })
        .map(([k, label]) => `${label}: ${s[k] ? "✅" : "❌"}`).join("\n");
      await message.channel.send({ embeds: [info("AutoMod Settings", text)] });
    },
  },
  {
    name: "setautomod",
    description: "Toggle automod (prefix). Usage: -*-prefix*-setautomod <feature> [on/off]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.channel.send({ embeds: [error("No permission", "Need Manage Server.")] });
      const feature = args[0];
      const map = { profanity: "profanity", antispam: "antispam", links: "links", mention: "mentionSpam", invites: "invites", caps: "caps" };
      const key = map[feature];
      if (!key) return message.channel.send({ embeds: [error("Usage", "Features: profanity, antispam, links, mention, invites, caps")] });
      const want = args[1] === "on" ? true : args[1] === "off" ? false : undefined;
      const enabled = want !== undefined ? want : !store.getSettings(message.guild.id)[key];
      store.setSetting(message.guild.id, key, enabled);
      await message.channel.send({ embeds: [success("AutoMod", `${feature} is now ${enabled ? "on" : "off"}.`)] });
    },
  },
  {
    name: "addbadword",
    aliases: ["addword"],
    description: "Add a bad word (prefix). Usage: -*-prefix*-addbadword <word>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.channel.send({ embeds: [error("No permission", "Need Manage Server.")] });
      if (!args[0]) return message.channel.send({ embeds: [error("Usage", "Provide a word.")] });
      const word = args[0].toLowerCase();
      const s = store.getSettings(message.guild.id);
      const list = s.badwords || [];
      if (list.includes(word)) return message.channel.send({ embeds: [error("Exists", "Already filtered.")] });
      list.push(word);
      store.setSetting(message.guild.id, "badwords", list);
      await message.channel.send({ embeds: [success("Added", `**${word}** added to filter.`)] });
    },
  },
  {
    name: "raidmode",
    description: "Toggle raid mode (prefix). Usage: -*-prefix*-raidmode [on/off]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.channel.send({ embeds: [error("No permission", "Need Manage Server.")] });
      const want = args[0] === "on" ? true : args[0] === "off" ? false : !store.getSettings(message.guild.id).raidmode;
      store.setSetting(message.guild.id, "raidmode", want);
      await message.channel.send({ embeds: [success("Raid Mode", `Raid mode is now ${want ? "on" : "off"}.`)] });
    },
  },
  {
    name: "setwelcome",
    description: "Set welcome channel (prefix). Usage: -*-prefix*-setwelcome #channel",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.channel.send({ embeds: [error("No permission", "Need Manage Server.")] });
      const channel = message.mentions.channels.first();
      if (!channel) return message.channel.send({ embeds: [error("Usage", "Mention a channel.")] });
      store.setSetting(message.guild.id, "welcomeChannel", channel.id);
      await message.channel.send({ embeds: [success("Welcome", `Welcome channel set to ${channel}.`)] });
    },
  },
  {
    name: "setprefix",
    description: "Set bot prefix (prefix). Usage: -*-prefix*-setprefix <prefix>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageGuild)) return message.channel.send({ embeds: [error("No permission", "Need Manage Server.")] });
      if (!args[0]) return message.channel.send({ embeds: [error("Usage", "Provide a prefix.")] });
      store.setSetting(message.guild.id, "prefix", args[0]);
      await message.channel.send({ embeds: [success("Prefix Set", `Prefix is now \`${args[0]}\`.`)] });
    },
  },
  {
    name: "note",
    description: "Add a note (prefix). Usage: -*-prefix*-note @user <text>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) return message.channel.send({ embeds: [error("No permission", "Need Moderate Members.")] });
      const target = message.mentions.members.first();
      if (!target || args.length < 2) return message.channel.send({ embeds: [error("Usage", "Mention a user and provide note text.")] });
      store.addNote(message.guild.id, target.id, args.slice(1).join(" "), message.author.id);
      await message.channel.send({ embeds: [success("Note", `Note added for ${target.user.tag}.`)] });
    },
  },
  {
    name: "notes",
    description: "View notes (prefix). Usage: -*-prefix*-notes @user",
    async execute(message, args) {
      const target = message.mentions.members.first() || message.member;
      const notes = store.getNotes(message.guild.id, target.id);
      if (notes.length === 0) return message.channel.send({ embeds: [error("None", `No notes for ${target.user.tag}.`)] });
      const text = notes.map((n, i) => `**${i + 1}.** ${n.text} — *${n.date.slice(0, 10)}*`).slice(0, 20).join("\n");
      await message.channel.send({ embeds: [info(`Notes for ${target.user.tag}`, text)] });
    },
  },
  {
    name: "banlist",
    description: "List banned users (prefix).",
    async execute(message) {
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.channel.send({ embeds: [error("No permission", "Need Ban Members.")] });
      const bans = await message.guild.bans.fetch();
      if (bans.size === 0) return message.channel.send({ embeds: [error("None", "No banned users.")] });
      const text = bans.map((b) => `${b.user.tag}`).slice(0, 25).join("\n");
      await message.channel.send({ embeds: [info(`Ban List (${bans.size})`, text)] });
    },
  },
  {
    name: "unban",
    description: "Unban a user (prefix). Usage: -*-prefix*-unban <userid>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.BanMembers)) return message.channel.send({ embeds: [error("No permission", "Need Ban Members.")] });
      if (!args[0]) return message.channel.send({ embeds: [error("Usage", "Provide a user ID.")] });
      try {
        await message.guild.bans.remove(args[0]);
        await message.channel.send({ embeds: [success("Unbanned", `User ${args[0]} unbanned.`)] });
      } catch (e) {
        await message.channel.send({ embeds: [error("Failed", "Could not unban that ID.")] });
      }
    },
  },
  {
    name: "addrole",
    description: "Add role (prefix). Usage: -*-prefix*-addrole @user @role",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.channel.send({ embeds: [error("No permission", "Need Manage Roles.")] });
      const target = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!target || !role) return message.channel.send({ embeds: [error("Usage", "Mention a user and a role.")] });
      await target.roles.add(role);
      await message.channel.send({ embeds: [success("Added", `Added ${role} to ${target.user.tag}.`)] });
    },
  },
  {
    name: "removerole",
    description: "Remove role (prefix). Usage: -*-prefix*-removerole @user @role",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) return message.channel.send({ embeds: [error("No permission", "Need Manage Roles.")] });
      const target = message.mentions.members.first();
      const role = message.mentions.roles.first();
      if (!target || !role) return message.channel.send({ embeds: [error("Usage", "Mention a user and a role.")] });
      await target.roles.remove(role);
      await message.channel.send({ embeds: [success("Removed", `Removed ${role} from ${target.user.tag}.`)] });
    },
  },
  {
    name: "nickname",
    aliases: ["nick"],
    description: "Change nickname (prefix). Usage: -*-prefix*-nick @user [name]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageNicknames)) return message.channel.send({ embeds: [error("No permission", "Need Manage Nicknames.")] });
      const target = message.mentions.members.first();
      if (!target) return message.channel.send({ embeds: [error("Usage", "Mention a user.")] });
      const nick = args.slice(1).join(" ");
      await target.setNickname(nick || null);
      await message.channel.send({ embeds: [success("Nickname", `Set ${target.user.tag}'s nickname to \`${nick || "cleared"}\`.`)] });
    },
  },
  {
    name: "roleinfo",
    description: "Role info (prefix). Usage: -*-prefix*-roleinfo @role",
    async execute(message, args) {
      const role = message.mentions.roles.first();
      if (!role) return message.channel.send({ embeds: [error("Usage", "Mention a role.")] });
      await message.channel.send({ embeds: [info(`@${role.name}`, `ID: ${role.id}\nColor: #${role.color.toString(16).padStart(6, "0")}\nMembers: ${role.members.size}\nPosition: ${role.position}`)] });
    },
  },
  {
    name: "clear",
    aliases: ["cls"],
    description: "Clear messages (prefix). Usage: -*-prefix*-clear [amount]",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) return message.channel.send({ embeds: [error("No permission", "Need Manage Messages.")] });
      const amount = Math.min(Math.max(parseInt(args[0] || "10", 10), 1), 100);
      await message.delete().catch(() => {});
      await message.channel.bulkDelete(amount, true);
      const m = await message.channel.send({ embeds: [success("Cleared", `Deleted ${amount} messages.`)] });
      setTimeout(() => m.delete().catch(() => {}), 3000);
    },
  },
];
