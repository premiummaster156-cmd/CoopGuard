const { EmbedBuilder } = require("discord.js");
const config = require("../../../config");
const { success, error, info } = require("../../../utils/embed");

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

module.exports = [
  {
    name: "help",
    aliases: ["h"],
    description: "Show help (prefix).",
    async execute(message) {
      const commands = message.client.prefixCommands;
      const text = commands.map((c) => `\`${config.prefix}${c.name}\` — ${c.description.replace(/\*-prefix-\*/g, config.prefix)}`).slice(0, 40).join("\n");
      await message.channel.send({ embeds: [info("CoopGuard Prefix Help", text.slice(0, 4000))] });
    },
  },
  {
    name: "ping",
    description: "Pong! (prefix).",
    async execute(message) {
      const now = Date.now();
      const m = await message.channel.send({ embeds: [info("Pinging...")] });
      await m.edit({ embeds: [success("Pong!", `Latency: ${Date.now() - now}ms | API: ${Math.round(message.client.ws.ping)}ms`)] });
    },
  },
  {
    name: "botinfo",
    aliases: ["info"],
    description: "Bot info (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [info("🤖 CoopGuard", `Servers: ${message.client.guilds.cache.size}\nUsers: ${message.client.users.cache.size}\nSlash: ${message.client.slashCommands.size}\nPrefix: ${message.client.prefixCommands.size}`)] });
    },
  },
  {
    name: "avatar",
    aliases: ["av"],
    description: "Get avatar (prefix). Usage: -*-prefix*-avatar [@user]",
    async execute(message, args) {
      const user = message.mentions.users.first() || message.author;
      await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`${user.tag}'s Avatar`).setColor(config.colors.primary).setImage(user.displayAvatarURL({ size: 1024 }))] });
    },
  },
  {
    name: "serverinfo",
    aliases: ["server"],
    description: "Server info (prefix).",
    async execute(message) {
      const g = message.guild;
      await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`📊 ${g.name}`).setColor(config.colors.primary).setThumbnail(g.iconURL()).addFields(
        { name: "ID", value: g.id, inline: true },
        { name: "Members", value: String(g.memberCount), inline: true },
        { name: "Owner", value: g.ownerId, inline: true },
        { name: "Channels", value: String(g.channels.cache.size), inline: true },
        { name: "Roles", value: String(g.roles.cache.size), inline: true },
        { name: "Boost", value: String(g.premiumTier), inline: true },
      )] });
    },
  },
  {
    name: "whois",
    aliases: ["userinfo"],
    description: "User info (prefix). Usage: -*-prefix*-whois [@user]",
    async execute(message, args) {
      const target = message.mentions.members.first() || message.member;
      await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`${target.user.tag}`).setColor(config.colors.primary).setThumbnail(target.user.displayAvatarURL()).addFields(
        { name: "ID", value: target.id, inline: true },
        { name: "Joined", value: new Date(target.joinedAt).toLocaleDateString(), inline: true },
        { name: "Roles", value: target.roles.cache.map((r) => r.name).join(", ") },
      )] });
    },
  },
  {
    name: "invite",
    aliases: ["inv"],
    description: "Bot invite link (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [success("Invite", `Invite CoopGuard: https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`)] });
    },
  },
  {
    name: "uptime",
    description: "Bot uptime (prefix).",
    async execute(message) {
      const s = Math.floor(message.client.uptime / 1000);
      await message.channel.send({ embeds: [success("Uptime", `${Math.floor(s / 86400)}d ${Math.floor((s % 86400) / 3600)}h ${Math.floor((s % 3600) / 60)}m ${s % 60}s`)] });
    },
  },
  {
    name: "echo",
    aliases: ["say"],
    description: "Make bot say something (prefix). Usage: -*-prefix*-echo <text>",
    async execute(message, args) {
      if (args.length === 0) return message.channel.send({ embeds: [error("Usage", "Provide text to echo.")] });
      await message.channel.send(args.join(" "));
    },
  },
  {
    name: "poll",
    description: "Create a poll (prefix). Usage: -*-prefix*-poll question | option1 | option2",
    async execute(message, args) {
      const parts = args.join(" ").split("|").map((s) => s.trim());
      if (parts.length < 1) return message.channel.send({ embeds: [error("Usage", "Provide a question.")] });
      const question = parts[0];
      const opt1 = parts[1] || "Yes";
      const opt2 = parts[2] || "No";
      const m = await message.channel.send({ embeds: [new EmbedBuilder().setTitle(`📊 ${question}`).setColor(config.colors.primary).setDescription(`**1️⃣ ${opt1}**\n**2️⃣ ${opt2}**`)] });
      await m.react("1️⃣");
      await m.react("2️⃣");
    },
  },
  {
    name: "8ball",
    description: "Ask the 8-ball (prefix). Usage: -*-prefix*-8ball <question>",
    async execute(message, args) {
      const answers = ["Yes", "No", "Maybe", "Definitely", "Ask again later", "Cannot predict now", "Without a doubt", "Don't count on it", "Outlook good", "Signs point to yes"];
      await message.channel.send({ embeds: [info("🎱 8-Ball", `**Q:** ${args.join(" ") || "..."}\n\n**A:** ${rand(answers)}`)] });
    },
  },
  {
    name: "coin",
    aliases: ["coinflip"],
    description: "Flip a coin (prefix).",
    async execute(message) {
      await message.channel.send({ embeds: [success("🪙", `You got **${Math.random() < 0.5 ? "Heads" : "Tails"}**!`)] });
    },
  },
  {
    name: "roll",
    aliases: ["dice"],
    description: "Roll a die (prefix). Usage: -*-prefix*-roll [sides]",
    async execute(message, args) {
      const sides = parseInt(args[0] || "6", 10);
      await message.channel.send({ embeds: [success(`🎲 d${sides}`, `You rolled **${Math.floor(Math.random() * sides) + 1}**!`)] });
    },
  },
  {
    name: "joke",
    description: "Get a joke (prefix).",
    async execute(message) {
      const jokes = ["Why don't scientists trust atoms? Because they make up everything!", "I told my wife she should embrace her mistakes. She hugged me.", "Why did the scarecrow win an award? Because he was outstanding in his field!", "What do you call a fake noodle? An impasta!", "Why don't skeletons fight each other? They don't have the guts."];
      await message.channel.send({ embeds: [success("😂 Joke", rand(jokes))] });
    },
  },
  {
    name: "reverse",
    description: "Reverse text (prefix). Usage: -*-prefix*-reverse <text>",
    async execute(message, args) {
      if (args.length === 0) return message.channel.send({ embeds: [error("Usage", "Provide text.")] });
      await message.channel.send({ embeds: [info("🔁", args.join(" ").split("").reverse().join(""))] });
    },
  },
  {
    name: "rate",
    description: "Rate something (prefix). Usage: -*-prefix*-rate <thing>",
    async execute(message, args) {
      const score = Math.floor(Math.random() * 11);
      await message.channel.send({ embeds: [info("⭐", `I rate **${args.join(" ") || "that"}** a **${score}/10**.`)] });
    },
  },
  {
    name: "ship",
    description: "Ship two users (prefix). Usage: -*-prefix*-ship @u1 @u2",
    async execute(message, args) {
      const u1 = message.mentions.users.first();
      const u2 = message.mentions.users.last();
      if (!u1 || !u2) return message.channel.send({ embeds: [error("Usage", "Mention two users.")] });
      const score = Math.floor(Math.random() * 101);
      await message.channel.send({ embeds: [info("💘", `${u1} ❤️ ${u2}\n**Compatibility: ${score}%**`)] });
    },
  },
  {
    name: "catfact",
    description: "Get a cat fact (prefix).",
    async execute(message) {
      const facts = ["Cats sleep 70% of their lives.", "A cat's nose print is unique.", "Cats can't taste sweetness.", "A group of cats is called a clowder."];
      await message.channel.send({ embeds: [success("🐱", rand(facts))] });
    },
  },
  {
    name: "roast",
    description: "Roast a user (prefix). Usage: -*-prefix*-roast @user",
    async execute(message, args) {
      const user = message.mentions.users.first();
      if (!user) return message.channel.send({ embeds: [error("Usage", "Mention a user.")] });
      const roasts = ["You're the reason the gene pool needs a lifeguard.", "I'd agree with you but then we'd both be wrong.", "You're not dumb, just unlucky in thinking."];
      await message.channel.send({ embeds: [info("🔥", `${user}, ${rand(roasts)}`)] });
    },
  },
  {
    name: "emoji",
    description: "Enlarge an emoji (prefix). Usage: -*-prefix*-emoji :emoji:",
    async execute(message, args) {
      const em = args[0];
      const match = em && em.match(/<a?:\w+:(\d+)>/);
      if (!match) return message.channel.send({ embeds: [error("Invalid", "Provide a custom emoji.")] });
      await message.channel.send({ content: `https://cdn.discordapp.com/emojis/${match[1]}.${em.startsWith("<a:") ? "gif" : "png"}?size=128` });
    },
  },
  {
    name: "servericon",
    aliases: ["icon"],
    description: "Server icon (prefix).",
    async execute(message) {
      const icon = message.guild.iconURL({ size: 1024 });
      if (!icon) return message.channel.send({ embeds: [error("No icon", "Server has no icon.")] });
      await message.channel.send({ embeds: [new EmbedBuilder().setColor(config.colors.primary).setImage(icon)] });
    },
  },
  {
    name: "translate",
    description: "Translate text (prefix, placeholder). Usage: -*-prefix*-translate <text>",
    async execute(message, args) {
      await message.channel.send({ embeds: [info("Translate", `Translation requires an API key. Text: ${args.join(" ") || "..."}`)] });
    },
  },
  {
    name: "slowmo",
    aliases: ["slow"],
    description: "Set slowmode (prefix). Usage: -*-prefix*-slow <seconds>",
    async execute(message, args) {
      if (!message.member.permissions.has(PermissionFlagsBits.ManageChannels)) return message.channel.send({ embeds: [error("No permission", "Need Manage Channels.")] });
      const secs = parseInt(args[0] || "0", 10);
      await message.channel.setRateLimitPerUser(secs);
      await message.channel.send({ embeds: [success("Slowmode", `Set to ${secs}s.`)] });
    },
  },
];
