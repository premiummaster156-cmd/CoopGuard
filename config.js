require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  clientId: process.env.CLIENT_ID,
  devGuildId: process.env.DEV_GUILD_ID || null,
  prefix: process.env.PREFIX || "!",
  ownerIds: (process.env.OWNER_IDS || "").split(",").map((s) => s.trim()).filter(Boolean),
  logChannelId: process.env.LOG_CHANNEL_ID || null,
  memberRoleId: process.env.MEMBER_ROLE_ID || null,
  warnAutoMuteLimit: parseInt(process.env.WARN_AUTOMUTE_LIMIT || "3", 10),
  databaseUrl: process.env.DATABASE_URL || null,
  colors: {
    primary: 0x5b8eff,
    success: 0x22c55e,
    warning: 0xf59e0b,
    danger: 0xef4444,
    info: 0x3b82f6,
    neutral: 0x64748b,
  },
};
