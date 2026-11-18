const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const store = require("../../../utils/store");
const config = require("../../../config");
const { success, error, info, warning } = require("../../../utils/embed");

module.exports = [
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("help")
      .setDescription("Show a list of all commands."),
    async execute(interaction) {
      const commands = interaction.client.slashCommands;
      const categories = {};
      for (const [, cmd] of commands) {
        const cat = cmd.category || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(`\`/${cmd.data.name}\` — ${cmd.data.description}`);
      }
      const embed = info("CoopGuard Help", `Here are **${commands.size}** slash commands. Use \`/server\` for info.`)
        .setThumbnail(interaction.client.user.displayAvatarURL());
      for (const [cat, list] of Object.entries(categories)) {
        embed.addFields({ name: `📁 ${cat.charAt(0).toUpperCase() + cat.slice(1)}`, value: list.join("\n").slice(0, 1024) });
      }
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Check the bot's latency."),
    async execute(interaction) {
      const sent = await interaction.reply({ embeds: [info("Pinging...")], fetchReply: true });
      const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply({ embeds: [success("Pong!", `Latency: **${roundtrip}ms**\nAPI Latency: **${Math.round(interaction.client.ws.ping)}ms**`)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("botinfo")
      .setDescription("Information about the bot."),
    async execute(interaction) {
      const { EmbedBuilder } = require("discord.js");
      const uptime = Math.floor(interaction.client.uptime / 1000);
      const embed = new EmbedBuilder()
        .setTitle(interaction.client.user.tag)
        .setColor(config.colors.primary)
        .setThumbnail(interaction.client.user.displayAvatarURL())
        .addFields(
          { name: "Servers", value: String(interaction.client.guilds.cache.size), inline: true },
          { name: "Users", value: String(interaction.client.users.cache.size), inline: true },
          { name: "Uptime", value: `${uptime}s`, inline: true },
          { name: "Slash Commands", value: String(interaction.client.slashCommands.size), inline: true },
          { name: "Version", value: "1.0.0", inline: true },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("avatar")
      .setDescription("Get a user's avatar.")
      .addUserOption((o) => o.setName("user").setDescription("The user")),
    async execute(interaction) {
      const user = interaction.options.getUser("user") || interaction.user;
      const embed = new EmbedBuilder()
        .setTitle(`${user.tag}'s Avatar`)
        .setColor(config.colors.primary)
        .setImage(user.displayAvatarURL({ size: 1024 }));
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("invite")
      .setDescription("Get the bot's invite link."),
    async execute(interaction) {
      const link = `https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=bot%20applications.commands`;
      await interaction.reply({ embeds: [success("Invite Me", `[Click here to invite CoopGuard](${link})`)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("serverinfo")
      .setDescription("Get information about this server."),
    async execute(interaction) {
      const g = interaction.guild;
      const owner = await g.fetchOwner().catch(() => null);
      const embed = new EmbedBuilder()
        .setTitle(`📊 ${g.name}`)
        .setColor(config.colors.primary)
        .setThumbnail(g.iconURL())
        .addFields(
          { name: "ID", value: g.id, inline: true },
          { name: "Owner", value: owner ? owner.user.tag : "Unknown", inline: true },
          { name: "Members", value: String(g.memberCount), inline: true },
          { name: "Channels", value: String(g.channels.cache.size), inline: true },
          { name: "Roles", value: String(g.roles.cache.size), inline: true },
          { name: "Boost Level", value: String(g.premiumTier), inline: true },
          { name: "Created", value: new Date(g.createdAt).toLocaleDateString(), inline: true },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("whois")
      .setDescription("Get information about a user.")
      .addUserOption((o) => o.setName("user").setDescription("The user")),
    async execute(interaction) {
      const user = interaction.options.getUser("user") || interaction.user;
      const member = interaction.guild.members.cache.get(user.id);
      const embed = new EmbedBuilder()
        .setTitle(user.tag)
        .setColor(config.colors.primary)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
          { name: "ID", value: user.id, inline: true },
          { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
          { name: "Joined", value: member ? new Date(member.joinedAt).toLocaleDateString() : "N/A", inline: true },
          { name: "Created", value: new Date(user.createdAt).toLocaleDateString(), inline: true },
          { name: "Roles", value: member ? member.roles.cache.map((r) => r.name).join(", ") : "N/A" },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("servericon")
      .setDescription("Get the server's icon."),
    async execute(interaction) {
      const icon = interaction.guild.iconURL({ size: 1024 });
      if (!icon) return interaction.reply({ embeds: [error("No icon", "This server has no icon.")], ephemeral: true });
      const embed = new EmbedBuilder().setTitle(interaction.guild.name).setColor(config.colors.primary).setImage(icon);
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("banner")
      .setDescription("Get the server banner."),
    async execute(interaction) {
      const banner = interaction.guild.bannerURL({ size: 1024 });
      if (!banner) return interaction.reply({ embeds: [error("No banner", "This server has no banner.")], ephemeral: true });
      const embed = new EmbedBuilder().setTitle(interaction.guild.name).setColor(config.colors.primary).setImage(banner);
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("emoji")
      .setDescription("Get a larger version of an emoji.")
      .addStringOption((o) => o.setName("emoji").setDescription("The emoji").setRequired(true)),
    async execute(interaction) {
      const emoji = interaction.options.getString("emoji");
      const match = emoji.match(/<a?:\w+:(\d+)>/);
      if (!match) return interaction.reply({ embeds: [error("Invalid emoji", "That's not a custom emoji.")], ephemeral: true });
      const isAnimated = emoji.startsWith("<a:");
      const url = `https://cdn.discordapp.com/emojis/${match[1]}.${isAnimated ? "gif" : "png"}?size=128`;
      const embed = new EmbedBuilder().setColor(config.colors.primary).setImage(url);
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("rolemembers")
      .setDescription("List members with a given role.")
      .addRoleOption((o) => o.setName("role").setDescription("The role").setRequired(true)),
    async execute(interaction) {
      const role = interaction.options.getRole("role");
      const members = role.members.map((m) => m.user.tag).slice(0, 25).join("\n") || "No members";
      await interaction.reply({ embeds: [info(`Members with @${role.name}`, members)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("translate")
      .setDescription("Translate text (placeholder — connect an API).")
      .addStringOption((o) => o.setName("text").setDescription("Text to translate").setRequired(true)),
    async execute(interaction) {
      const text = interaction.options.getString("text");
      await interaction.reply({ embeds: [warning("Translate", `Translation requires an API key. Here is your text:\n> ${text}`)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("echo")
      .setDescription("Make the bot say something.")
      .addStringOption((o) => o.setName("message").setDescription("Message to send").setRequired(true)),
    async execute(interaction) {
      const msg = interaction.options.getString("message");
      await interaction.reply({ embeds: [info("Echo", msg)] });
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("poll")
      .setDescription("Create a poll.")
      .addStringOption((o) => o.setName("question").setDescription("The question").setRequired(true))
      .addStringOption((o) => o.setName("option1").setDescription("Option 1"))
      .addStringOption((o) => o.setName("option2").setDescription("Option 2")),
    async execute(interaction) {
      const q = interaction.options.getString("question");
      const o1 = interaction.options.getString("option1") || "Yes";
      const o2 = interaction.options.getString("option2") || "No";
      const embed = new EmbedBuilder()
        .setTitle(`📊 ${q}`)
        .setColor(config.colors.primary)
        .setDescription(`**1️⃣ ${o1}**\n**2️⃣ ${o2}**`)
        .setFooter({ text: `Poll by ${interaction.user.tag}` });
      const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
      await msg.react("1️⃣");
      await msg.react("2️⃣");
    },
  },
  {
    category: "utility",
    data: new SlashCommandBuilder()
      .setName("uptime")
      .setDescription("How long has the bot been online?"),
    async execute(interaction) {
      const s = Math.floor(interaction.client.uptime / 1000);
      const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
      await interaction.reply({ embeds: [success("Uptime", `**${d}d ${h}h ${m}m ${sec}s**`)] });
    },
  },
];
