const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const store = require("../../../utils/store");
const { success, error, info } = require("../../../utils/embed");
const config = require("../../../config");

module.exports = [
  {
    category: "settings",
    data: new SlashCommandBuilder()
      .setName("setwelcome")
      .setDescription("Set the welcome channel for new members.")
      .addChannelOption((o) => o.setName("channel").setDescription("The welcome channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "welcomeChannel", channel.id);
      await interaction.reply({ embeds: [success("Welcome Set", `Welcome channel set to ${channel}.`)] });
    },
  },
  {
    category: "settings",
    data: new SlashCommandBuilder()
      .setName("setmemberrole")
      .setDescription("Set the auto-assigned role for new members.")
      .addRoleOption((o) => o.setName("role").setDescription("The role").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const role = interaction.options.getRole("role");
      store.setSetting(interaction.guild.id, "memberRole", role.id);
      await interaction.reply({ embeds: [success("Member Role Set", `New members will get role **${role.name}**.`)] });
    },
  },
  {
    category: "settings",
    data: new SlashCommandBuilder()
      .setName("setmodlog")
      .setDescription("Set the moderation log channel.")
      .addChannelOption((o) => o.setName("channel").setDescription("The log channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "modlog", channel.id);
      await interaction.reply({ embeds: [success("Mod Log Set", `Moderation log channel set to ${channel}.`)] });
    },
  },
  {
    category: "settings",
    data: new SlashCommandBuilder()
      .setName("setlogs")
      .setDescription("Set the general logs channel.")
      .addChannelOption((o) => o.setName("channel").setDescription("The log channel").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const channel = interaction.options.getChannel("channel");
      store.setSetting(interaction.guild.id, "logsChannel", channel.id);
      await interaction.reply({ embeds: [success("Logs Set", `General logs channel set to ${channel}.`)] });
    },
  },
  {
    category: "settings",
    data: new SlashCommandBuilder()
      .setName("settings")
      .setDescription("View all server settings."),
    async execute(interaction) {
      const s = store.getSettings(interaction.guild.id);
      const embed = info("Server Settings", "Click to edit using the /set commands")
        .addFields(
          Object.entries(s).map(([k, v]) => ({ name: k, value: typeof v === "string" ? `<#${v}>` : String(v), inline: true }))
        );
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "settings",
    data: new SlashCommandBuilder()
      .setName("setwelcomeembed")
      .setDescription("Set a custom welcome message.")
      .addStringOption((o) => o.setName("message").setDescription("Welcome message (use {user} for member)").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      const message = interaction.options.getString("message");
      store.setSetting(interaction.guild.id, "welcomeMessage", message);
      await interaction.reply({ embeds: [success("Welcome Message Set", "Custom welcome message saved!")] });
    },
  },
  {
    category: "settings",
    data: new SlashCommandBuilder()
      .setName("reset")
      .setDescription("Reset a server setting.")
      .addStringOption((o) => o.setName("setting").setDescription("Setting to reset").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
      // Reset is a no-op placeholder (would need full settings management)
      await interaction.reply({ embeds: [info("Reset", "This resets the setting. (Placeholder — implement full settings store).")] });
    },
  },
];
