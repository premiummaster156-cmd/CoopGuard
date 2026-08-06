const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const store = require("../../../utils/store");
const { success, error, info } = require("../../../utils/embed");

module.exports = [
  {
    category: "automod",
    data: new SlashCommandBuilder()
      .setName("automod")
      .setDescription("View current automod settings."),
    async execute(interaction) {
      const s = store.getSettings(interaction.guild.id);
      const embed = info("AutoMod Settings", "Current configuration for this server")
        .addFields(
          { name: "Profanity Filter", value: s.profanity ? "Enabled" : "Disabled", inline: true },
          { name: "Spam Protection", value: s.antispam ? "Enabled" : "Disabled", inline: true },
          { name: "Link Filter", value: s.links ? "Enabled" : "Disabled", inline: true },
          { name: "Mention Spam", value: s.mentionSpam ? "Enabled" : "Disabled", inline: true },
          { name: "Invite Filter", value: s.invites ? "Enabled" : "Disabled", inline: true },
          { name: "Caps Filter", value: s.caps ? "Enabled" : "Disabled", inline: true },
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "automod",
    data: new SlashCommandBuilder()
      .setName("setautomod")
      .setDescription("Toggle an automod feature.")
      .addStringOption((o) => o.setName("feature").setDescription("The feature").setRequired(true)
        .addChoices(
          { name: "Profanity", value: "profanity" },
          { name: "Anti-spam", value: "antispam" },
          { name: "Link filter", value: "links" },
          { name: "Mention spam", value: "mentionSpam" },
          { name: "Invite filter", value: "invites" },
          { name: "Caps filter", value: "caps" },
        ))
.addBooleanOption((o) => o.setName("enabled").setDescription("Enabled?"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const feature = interaction.options.getString("feature");
      let enabled = interaction.options.getBoolean("enabled");
      const current = store.getSettings(interaction.guild.id)[feature];
      if (enabled === null) enabled = !current;
      store.setSetting(interaction.guild.id, feature, enabled);
      await interaction.reply({ embeds: [success("AutoMod Updated", `${feature} is now **${enabled ? "enabled" : "disabled"}**.`)] });
    },
  },
  {
    category: "automod",
    data: new SlashCommandBuilder()
      .setName("addbadword")
      .setDescription("Add a word to the profanity filter.")
      .addStringOption((o) => o.setName("word").setDescription("The word").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const word = interaction.options.getString("word").toLowerCase();
      const s = store.getSettings(interaction.guild.id);
      const list = s.badwords || [];
      if (list.includes(word)) return interaction.reply({ embeds: [error("Already Added", "That word is already filtered.")], ephemeral: true });
      list.push(word);
      store.setSetting(interaction.guild.id, "badwords", list);
      await interaction.reply({ embeds: [success("Word Added", `Added **${word}** to the profanity filter.`)] });
    },
  },
  {
    category: "automod",
    data: new SlashCommandBuilder()
      .setName("automodlog")
      .setDescription("Set the channel where automod actions are logged.")
      .addChannelOption((o) => o.setName("channel").setDescription("The log channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "automodChannel", channel.id);
      await interaction.reply({ embeds: [success("Log Channel Set", `AutoMod log channel set to ${channel}.`)] });
    },
  },
  {
    category: "automod",
    data: new SlashCommandBuilder()
      .setName("raidmode")
      .setDescription("Enable/disable raid protection.")
      .addBooleanOption((o) => o.setName("enabled").setDescription("Enable?").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const enabled = interaction.options.getBoolean("enabled");
      store.setSetting(interaction.guild.id, "raidmode", enabled);
      await interaction.reply({ embeds: [success("Raid Mode", `Raid mode is now **${enabled ? "enabled" : "disabled"}**.`)] });
    },
  },
  {
    category: "automod",
    data: new SlashCommandBuilder()
      .setName("massmention")
      .setDescription("Set the max mentions allowed before action.")
      .addIntegerOption((o) => o.setName("limit").setDescription("Max mentions (e.g. 5)").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const limit = interaction.options.getInteger("limit");
      store.setSetting(interaction.guild.id, "mentionLimit", limit);
      await interaction.reply({ embeds: [success("Mention Limit", `Mass-mention limit set to **${limit}**.`)] });
    },
  },
];
