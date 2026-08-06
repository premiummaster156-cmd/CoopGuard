const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const store = require("../../../utils/store");
const { ensureTarget, canInteract } = require("../../../utils/moderation");
const { success, error } = require("../../../utils/embed");
const { logAction } = require("../../../utils/modlog");

module.exports = [
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("banid")
      .setDescription("Ban a user by their ID (even if they're not in the server).")
      .addStringOption((o) => o.setName("userid").setDescription("The user's ID").setRequired(true))
      .addStringOption((o) => o.setName("reason").setDescription("Reason"))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
      const id = interaction.options.getString("userid");
      const reason = interaction.options.getString("reason") || "No reason provided";
      try {
        await interaction.guild.bans.create(id, { reason });
        await logAction(interaction.guild, "Ban (ID)", [
          { name: "User ID", value: id, inline: true },
          { name: "Moderator", value: interaction.user.tag, inline: true },
          { name: "Reason", value: reason },
        ]);
        await interaction.reply({ embeds: [success("Banned", `User **${id}** was banned.\nReason: ${reason}`)] });
      } catch (err) {
        await interaction.reply({ embeds: [error("Failed", "Could not ban that ID.")], ephemeral: true });
      }
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("unban")
      .setDescription("Unban a user by their ID.")
      .addStringOption((o) => o.setName("userid").setDescription("The user's ID").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
      const id = interaction.options.getString("userid");
      try {
        await interaction.guild.bans.remove(id);
        await interaction.reply({ embeds: [success("Unbanned", `User **${id}** was unbanned.`)] });
      } catch (err) {
        await interaction.reply({ embeds: [error("Failed", "Could not unban that ID.")], ephemeral: true });
      }
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("banlist")
      .setDescription("List all banned users.")
      .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction) {
      const bans = await interaction.guild.bans.fetch();
      if (bans.size === 0) return interaction.reply({ embeds: [error("No Bans", "There are no banned users.")] });
      const list = bans.map((b) => `**${b.user.tag}** (${b.user.id})`).slice(0, 25).join("\n");
      await interaction.reply({ embeds: [success("Ban List", `${list}\n\nTotal: **${bans.size}**`)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("purge")
      .setDescription("Delete a number of messages in the channel.")
      .addIntegerOption((o) => o.setName("amount").setDescription("Number of messages (1-100)").setRequired(true).setMinValue(1).setMaxValue(100))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
      const amount = interaction.options.getInteger("amount");
      await interaction.channel.bulkDelete(amount, true);
      const msg = await interaction.reply({ embeds: [success("Purged", `Deleted **${amount}** messages.`)], fetchReply: true });
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("purgeuser")
      .setDescription("Delete a user's recent messages.")
      .addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true))
      .addIntegerOption((o) => o.setName("amount").setDescription("Max messages to scan (1-100)").setMinValue(1).setMaxValue(100))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const amount = interaction.options.getInteger("amount") || 50;
      const messages = await interaction.channel.messages.fetch({ limit: Math.min(amount + 1, 100) });
      const toDelete = messages.filter((m) => m.author.id === user.id);
      if (toDelete.size === 0) return interaction.reply({ embeds: [error("No messages", `No recent messages from **${user.tag}**.`)], ephemeral: true });
      await interaction.channel.bulkDelete(toDelete, true);
      const msg = await interaction.reply({ embeds: [success("Purged", `Deleted **${toDelete.size}** messages from **${user.tag}**.`)], fetchReply: true });
      setTimeout(() => msg.delete().catch(() => {}), 3000);
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("lock")
      .setDescription("Lock the channel (prevent sends).")
      .addStringOption((o) => o.setName("reason").setDescription("Reason"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
      const reason = interaction.options.getString("reason") || "Channel locked";
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: false });
      await interaction.reply({ embeds: [success("Locked", `This channel was locked.\nReason: ${reason}`)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("unlock")
      .setDescription("Unlock the channel (allow sends).")
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, { SendMessages: null });
      await interaction.reply({ embeds: [success("Unlocked", "This channel was unlocked.")] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("slowmode")
      .setDescription("Set slowmode for the channel.")
      .addIntegerOption((o) => o.setName("seconds").setDescription("Seconds (0 disables)").setRequired(true).setMinValue(0).setMaxValue(21600))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
      const secs = interaction.options.getInteger("seconds");
      await interaction.channel.setRateLimitPerUser(secs);
      await interaction.reply({ embeds: [success("Slowmode", `Slowmode set to **${secs}** seconds.`)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("nickname")
      .setDescription("Change a member's nickname.")
      .addUserOption((o) => o.setName("user").setDescription("The member").setRequired(true))
      .addStringOption((o) => o.setName("nickname").setDescription("New nickname (blank to clear)"))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
    async execute(interaction) {
      const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
      if (!target) return interaction.reply({ embeds: [error("Failed", "User not found.")], ephemeral: true });
      const nick = interaction.options.getString("nickname");
      await target.setNickname(nick);
      await interaction.reply({ embeds: [success("Nickname", `Nickname for **${target.user.tag}** set to \`${nick || "cleared"}\`.`)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("addrole")
      .setDescription("Add a role to a member.")
      .addUserOption((o) => o.setName("user").setDescription("The member").setRequired(true))
      .addRoleOption((o) => o.setName("role").setDescription("The role").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
      const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
      const role = interaction.options.getRole("role");
      if (!target || !target.manageable) return interaction.reply({ embeds: [error("Failed", "I cannot add that role.")], ephemeral: true });
      await target.roles.add(role);
      await interaction.reply({ embeds: [success("Role Added", `Added **${role.name}** to **${target.user.tag}**.`)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("removerole")
      .setDescription("Remove a role from a member.")
      .addUserOption((o) => o.setName("user").setDescription("The member").setRequired(true))
      .addRoleOption((o) => o.setName("role").setDescription("The role").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
    async execute(interaction) {
      const target = await ensureTarget(interaction, interaction.options.getUser("user").id);
      const role = interaction.options.getRole("role");
      if (!target || !target.manageable) return interaction.reply({ embeds: [error("Failed", "I cannot remove that role.")], ephemeral: true });
      await target.roles.remove(role);
      await interaction.reply({ embeds: [success("Role Removed", `Removed **${role.name}** from **${target.user.tag}**.`)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("note")
      .setDescription("Add a private note to a member.")
      .addUserOption((o) => o.setName("user").setDescription("The member").setRequired(true))
      .addStringOption((o) => o.setName("text").setDescription("The note").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const text = interaction.options.getString("text");
      store.addNote(interaction.guild.id, user.id, text, interaction.user.id);
      await interaction.reply({ embeds: [success("Note Added", `Note added for **${user.tag}**.`)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("notes")
      .setDescription("View notes for a member.")
      .addUserOption((o) => o.setName("user").setDescription("The member").setRequired(true))
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const notes = store.getNotes(interaction.guild.id, user.id);
      if (notes.length === 0) return interaction.reply({ embeds: [error("No Notes", `No notes for **${user.tag}**.`)] });
      const text = notes.map((n, i) => `**${i + 1}.** ${n.text} — *${n.date.slice(0, 10)}*`).slice(0, 20).join("\n");
      await interaction.reply({ embeds: [success(`Notes for ${user.tag}`, text)] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("userinfo")
      .setDescription("Get detailed info about a user.")
      .addUserOption((o) => o.setName("user").setDescription("The user").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const member = interaction.guild.members.cache.get(user.id);
      const embed = {
        title: user.tag,
        color: 0x5b8eff,
        thumbnail: { url: user.displayAvatarURL() },
        fields: [
          { name: "ID", value: user.id, inline: true },
          { name: "Joined", value: member ? new Date(member.joinedAt).toLocaleDateString() : "N/A", inline: true },
          { name: "Account Created", value: new Date(user.createdAt).toLocaleDateString(), inline: true },
          { name: "Roles", value: member ? member.roles.cache.map((r) => r.name).join(", ") : "N/A" },
          { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
        ],
      };
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("serverinfo")
      .setDescription("Get detailed info about the server."),
    async execute(interaction) {
      const g = interaction.guild;
      const embed = {
        title: g.name,
        color: 0x5b8eff,
        thumbnail: { url: g.iconURL() },
        fields: [
          { name: "ID", value: g.id, inline: true },
          { name: "Owner", value: (await g.fetchOwner()).user.tag, inline: true },
          { name: "Members", value: String(g.memberCount), inline: true },
          { name: "Channels", value: String(g.channels.cache.size), inline: true },
          { name: "Roles", value: String(g.roles.cache.size), inline: true },
          { name: "Created", value: new Date(g.createdAt).toLocaleDateString(), inline: true },
          { name: "Boost Level", value: String(g.premiumTier), inline: true },
        ],
      };
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "moderation",
    data: new SlashCommandBuilder()
      .setName("roleinfo")
      .setDescription("Get info about a role.")
      .addRoleOption((o) => o.setName("role").setDescription("The role").setRequired(true)),
    async execute(interaction) {
      const role = interaction.options.getRole("role");
      const embed = {
        title: role.name,
        color: role.color || 0x5b8eff,
        fields: [
          { name: "ID", value: role.id, inline: true },
          { name: "Color", value: `#${role.color.toString(16).padStart(6, "0")}`, inline: true },
          { name: "Members", value: String(role.members.size), inline: true },
          { name: "Mentionable", value: role.mentionable ? "Yes" : "No", inline: true },
          { name: "Hoisted", value: role.hoist ? "Yes" : "No", inline: true },
          { name: "Position", value: String(role.position), inline: true },
        ],
      };
      await interaction.reply({ embeds: [embed] });
    },
  },
];
