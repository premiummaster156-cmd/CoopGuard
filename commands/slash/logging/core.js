const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const store = require("../../../utils/store");
const { success, error, info } = require("../../../utils/embed");

module.exports = [
  {
    category: "logging",
    data: new SlashCommandBuilder()
      .setName("setlogchannel")
      .setDescription("Set the channel for all moderation logs.")
      .addChannelOption((o) => o.setName("channel").setDescription("Log channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "logChannel", channel.id);
      await interaction.reply({ embeds: [success("Log Channel Set", `All logs will go to ${channel}.`)] });
    },
  },
  {
    category: "logging",
    data: new SlashCommandBuilder()
      .setName("enablelogs")
      .setDescription("Enable/disable a specific log type.")
      .addStringOption((o) => o.setName("type").setDescription("Log type").setRequired(true)
        .addChoices(
          { name: "Message Deletes", value: "messageDelete" },
          { name: "Message Edits", value: "messageEdit" },
          { name: "Channel Changes", value: "channelChange" },
          { name: "Role Changes", value: "roleChange" },
          { name: "Member Join/Leave", value: "memberJoin" },
          { name: "Member Updates", value: "memberUpdate" },
        ))
      .addBooleanOption((o) => o.setName("enabled").setDescription("Enabled?").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const type = interaction.options.getString("type");
      const enabled = interaction.options.getBoolean("enabled");
      store.setSetting(interaction.guild.id, `log_${type}`, enabled);
      await interaction.reply({ embeds: [success("Logging Updated", `${type} logging is now **${enabled ? "enabled" : "disabled"}**.`)] });
    },
  },
  {
    category: "logging",
    data: new SlashCommandBuilder()
      .setName("logsettings")
      .setDescription("View current logging settings."),
    async execute(interaction) {
      const types = ["messageDelete", "messageEdit", "channelChange", "roleChange", "memberJoin", "memberUpdate"];
      const s = store.getSettings(interaction.guild.id);
      const embed = info("Logging Settings", "Current logging configuration")
        .addFields(types.map((t) => ({ name: t, value: s[`log_${t}`] ? "Enabled" : "Disabled", inline: true })));
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "logging",
    data: new SlashCommandBuilder()
      .setName("audit")
      .setDescription("View recent audit log actions.")
      .addIntegerOption((o) => o.setName("limit").setDescription("Number to fetch (max 25)").setMinValue(1).setMaxValue(25))
      .setDefaultMemberPermissions(PermissionFlagsBits.ViewAuditLog),
    async execute(interaction) {
      const limit = interaction.options.getInteger("limit") || 10;
      const logs = await interaction.guild.fetchAuditLogs({ limit }).then((r) => r.entries);
      if (logs.size === 0) return interaction.reply({ embeds: [error("No logs", "No audit log entries found.")], ephemeral: true });
      const text = logs.map((l) => `**${l.actionType}** — ${l.executor?.tag || "Unknown"} → \`${l.target?.tag || l.target?.name || "n/a"}\``).slice(0, 25).join("\n");
      await interaction.reply({ embeds: [info("📜 Audit Log", text)] });
    },
  },
];
