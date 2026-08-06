<div align="center">

# 🛡️ CoopGuard

### The all-in-one Discord moderation bot with **68 slash commands** + **49 prefix commands**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org)
[![Discord.js](https://img.shields.io/badge/discord.js-14-blueviolet.svg)](https://discord.js.org)
[![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)](#)

</div>

CoopGuard is the flagship **moderation bot** from the CoopFT marketplace. It keeps your Discord server safe **24/7** with a full suite of moderation tools, auto-moderation, spam & raid protection, detailed logging, warnings system, and a user-friendly command interface available as both **slash commands** and **prefix commands**.

---

## 📦 Features

- 🚨 **Full Moderation** — kick, ban, mute, warn, purge, lock, slowmode, and more
- 🤖 **Auto-Moderation** — profanity filter, anti-spam, link filter, mention-spam protection, invite filter, caps filter
- 🛡️ **Raid Protection** — one-command raid mode to lock down your server
- ⚠️ **Warnings System** — warn history per user, auto-mute after threshold
- 📜 **Detailed Logging** — audit log viewer, configurable log channels & types
- 📝 **Notes** — private notes on members for staff
- 👋 **Welcome System** — auto-role assignment & custom welcome messages
- 🎉 **Fun Commands** — 8-ball, roast, ship, jokes, and more
- ⚙️ **Fully Configurable** — set prefix, welcome channel, member role, log channels
- 🔌 **Slash + Prefix** — every feature works as a slash (`/`) or prefix (`!`) command

---

## 🚀 Installation

### Prerequisites
- [Node.js](https://nodejs.org) **v18 or higher**
- A Discord application with a bot token ([Discord Developer Portal](https://discord.com/developers/applications))

### Step 1 — Create the bot on Discord

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Name it `CoopGuard`.
3. Go to the **Bot** tab → click **Reset Token** → copy the token.
4. Enable these **Privileged Gateway Intents**:
   - ✅ **Presence Intent**
   - ✅ **Server Members Intent**
   - ✅ **Message Content Intent**
5. Go to the **OAuth2 → URL Generator** tab:
   - Scopes: `bot`, `applications.commands`
   - Bot Permissions: **Administrator** (or select the specific permissions you want)
   - Use the generated URL to invite CoopGuard to your server.

### Step 2 — Set up the project

```bash
# Clone the repository
git clone https://github.com/CoopFT/CoopGuard.git
cd CoopGuard

# Install dependencies
npm install

# Copy the environment template
cp .env.example .env
```

### Step 3 — Configure `.env`

Open `.env` and fill in your values:

```env
TOKEN=YOUR_BOT_TOKEN_HERE
CLIENT_ID=YOUR_CLIENT_ID_HERE
DEV_GUILD_ID=            # Optional: for fast guild-scoped command registration
PREFIX=!
OWNER_IDS=               # Optional: your user ID (comma separated)
LOG_CHANNEL_ID=          # Optional: default moderation log channel
MEMBER_ROLE_ID=          # Optional: role auto-assigned to new members
WARN_AUTOMUTE_LIMIT=3    # Auto-mute after 3 warnings
```

### Step 4 — Register slash commands

```bash
# For a single server (instant) — set DEV_GUILD_ID first
npm run register:guild

# OR for global registration (takes up to 1 hour to propagate)
npm run deploy
```

### Step 5 — Run the bot

```bash
npm start
# or
npm run dev
```

You should see:
```
[OK] Loaded 68 slash commands.
[OK] Loaded 49 prefix commands.
[OK] Logged in as CoopGuard#1234
[INFO] Servers: 1
```

> 💡 Use `node deploy-commands.js` again whenever you modify slash commands.

---

## 🎮 Command Reference

### Slash Commands (`/`)

#### 🛡️ Moderation
| Command | Description |
|---------|-------------|
| `/kick @user [reason]` | Kick a member |
| `/ban @user [reason] [days]` | Ban a member |
| `/banid <userid> [reason]` | Ban by ID (even if not in server) |
| `/unban <userid>` | Unban a user |
| `/banlist` | List all banned users |
| `/mute @user [duration] [reason]` | Timeout a member |
| `/unmute @user` | Remove a timeout |
| `/warn @user [reason]` | Warn a member |
| `/warnings @user` | View a member's warnings |
| `/clearwarnings @user` | Clear a member's warnings |
| `/purge [amount]` | Delete messages |
| `/purgeuser @user [amount]` | Delete a user's messages |
| `/lock [reason]` | Lock the channel |
| `/unlock` | Unlock the channel |
| `/slowmode [seconds]` | Set channel slowmode |
| `/nickname @user [nickname]` | Change a member's nickname |
| `/addrole @user @role` | Add a role to a member |
| `/removerole @user @role` | Remove a role |
| `/note @user <text>` | Add a private note |
| `/notes @user` | View a member's notes |
| `/userinfo @user` | Detailed user info |
| `/serverinfo` | Detailed server info |
| `/roleinfo @role` | Role info |

#### 🤖 Auto-Moderation
| Command | Description |
|---------|-------------|
| `/automod` | View automod settings |
| `/setautomod <feature> [enabled]` | Toggle automod features |
| `/addbadword <word>` | Add a word to the profanity filter |
| `/automodlog #channel` | Set automod log channel |
| `/raidmode [enabled]` | Toggle raid protection |
| `/massmention <limit>` | Set mass-mention limit |

#### 📜 Logging
| Command | Description |
|---------|-------------|
| `/setlogchannel #channel` | Set the log channel |
| `/enablelogs <type> [enabled]` | Toggle specific log types |
| `/logsettings` | View logging config |
| `/audit [limit]` | View recent audit log actions |

#### ⚙️ Settings
| Command | Description |
|---------|-------------|
| `/setprefix <prefix>` | Change the prefix |
| `/setwelcome #channel` | Set welcome channel |
| `/setmemberrole @role` | Set auto-assign role |
| `/setmodlog #channel` | Set mod log channel |
| `/setlogs #channel` | Set general logs channel |
| `/setwelcomeembed <message>` | Custom welcome message |
| `/settings` | View all settings |
| `/reset <setting>` | Reset a setting |

#### 🎉 Fun
| Command | Description |
|---------|-------------|
| `/8ball <question>` | Ask the 8-ball |
| `/coinflip` | Flip a coin |
| `/diceroll [sides]` | Roll a die |
| `/rate <thing>` | Rate something |
| `/say <text>` | Make the bot say something |
| `/joke` | Get a joke |
| `/meme` | Get a meme |
| `/avatarfun @user` | Enlarged avatar |
| `/reverse <text>` | Reverse text |
| `/ship @u1 @u2` | Compatibility check |
| `/catfact` | Random cat fact |
| `/roast @user` | Light roast |

#### 🛠️ Utility
| Command | Description |
|---------|-------------|
| `/help` | Show all commands |
| `/ping` | Check latency |
| `/botinfo` | Bot information |
| `/avatar @user` | Get avatar |
| `/invite` | Bot invite link |
| `/serverinfo` | Server info |
| `/whois @user` | User info |
| `/servericon` | Server icon |
| `/banner` | Server banner |
| `/emoji :emoji:` | Enlarge an emoji |
| `/rolemembers @role` | List role members |
| `/translate <text>` | Translate text |
| `/echo <message>` | Echo a message |
| `/poll <question>` | Create a poll |
| `/uptime` | Bot uptime |

**Total: 68 slash commands** ✨

---

### Prefix Commands (`!`)

CoopGuard also supports old-school prefix commands. Use `!` by default (configurable via `/setprefix`).

| Command | Aliases | Description |
|---------|---------|-------------|
| `!kick` | `!k` | Kick a member |
| `!ban` | `!b` | Ban a member |
| `!warn` | `!w` | Warn a member |
| `!mute` | | Mute a member |
| `!unmute` | | Unmute a member |
| `!warnings` | `!warns` | View warnings |
| `!clearwarns` | `!cw` | Clear warnings |
| `!purge` | `!clear`, `!prune` | Delete messages |
| `!lock` | | Lock channel |
| `!unlock` | | Unlock channel |
| `!slowmode` | | Set slowmode |
| `!banlist` | | List bans |
| `!unban` | | Unban user |
| `!addrole` | | Add role |
| `!removerole` | | Remove role |
| `!nickname` | `!nick` | Change nickname |
| `!roleinfo` | | Role info |
| `!note` | | Add a note |
| `!notes` | | View notes |
| `!clear` | `!cls` | Clear messages |
| `!automod` | `!am` | View automod settings |
| `!setautomod` | | Toggle automod |
| `!addbadword` | `!addword` | Add bad word |
| `!raidmode` | | Toggle raid mode |
| `!setwelcome` | | Set welcome channel |
| `!setprefix` | | Set prefix |
| `!help` | `!h` | Show help |
| `!ping` | | Pong |
| `!botinfo` | `!info` | Bot info |
| `!avatar` | `!av` | Get avatar |
| `!serverinfo` | `!server` | Server info |
| `!whois` | `!userinfo` | User info |
| `!invite` | `!inv` | Invite link |
| `!uptime` | | Uptime |
| `!echo` | `!say` | Echo |
| `!poll` | | Create poll |
| `!8ball` | | Ask 8-ball |
| `!coin` | `!coinflip` | Coin flip |
| `!roll` | `!dice` | Roll die |
| `!joke` | | Joke |
| `!reverse` | | Reverse text |
| `!rate` | | Rate something |
| `!ship` | | Ship users |
| `!catfact` | | Cat fact |
| `!roast` | | Roast user |
| `!emoji` | | Enlarge emoji |
| `!servericon` | `!icon` | Server icon |
| `!translate` | | Translate |
| `!slowmo` | `!slow` | Set slowmode |

**Total: 49 prefix commands** 🤖

---

## 📘 Tutorial — How to Use CoopGuard

### 1. Setup & Configuration

1. **Invite the bot** to your server using the OAuth2 URL (see Installation).
2. Grant CoopGuard the **Administrator** permission so all features work.
3. Run `/setlogchannel #logs` to choose where moderation actions are logged.
4. Run `/setwelcome #welcome` and `/setmemberrole @Member` to set up the welcome system.

### 2. Moderation Basics

- **Warn a troublemaker:** `/warn @user spamming in general`
- **Check their history:** `/warnings @user`
- **Mute them:** `/mute @user 1h stop spamming`
- **Purge spam:** `/purge 50`
- **Ban a persistent offender:** `/ban @user repeated harassment 7`

### 3. Auto-Moderation Setup

1. Run `/setautomod profanity` to enable the profanity filter.
2. Add custom words: `/addbadword slurs`
3. Enable anti-spam: `/setautomod antispam`
4. Set the log channel: `/automodlog #logs`
5. Review what's on: `/automod`

### 4. Raid Protection

When you suspect a raid or mass join:
```
/setautomod raidmode on
```
or prefix:
```
!raidmode on
```
This locks down the server. Turn it off when the threat passes.

### 5. Using Prefix Commands

Some users prefer prefix commands. Just type the prefix:
```
!kick @user
!purge 30
!mute @user 10m
!warnings @user
```

### 6. Best Practices

- Always set a **log channel** so actions are recorded.
- Use `/warn` before escalating to `/ban` for first-time offenders.
- Enable **raid mode** during giveaways or announcements to deter raids.
- Keep your automod **bad-word list** up to date with `/addbadword`.

---

## 🗂️ Project Structure

```
CoopGuard/
├── index.js                 # Entry point — starts the bot
├── deploy-commands.js       # Registers slash commands
├── config.js                # Configuration loader
├── .env.example             # Environment template
├── commands/
│   ├── slash/               # 68 slash commands
│   │   ├── moderation/      # kick, ban, mute, warn, etc.
│   │   ├── automod/         # automod features
│   │   ├── fun/             # fun commands
│   │   ├── logging/         # logging commands
│   │   ├── settings/        # server settings
│   │   └── utils/           # utility commands
│   └── prefix/              # 49 prefix commands
│       ├── moderation.js
│       ├── utility.js
│       └── automod.js
├── handlers/                # Event handlers
├── utils/                   # Helpers (store, embed, modlog, etc.)
├── data/                    # Auto-created JSON data store
└── package.json
```

---

## 🔧 Development

Want to add a command? It's easy:

### Add a slash command
1. Create a file in `commands/slash/<category>/`.
2. Export an object with `data` (SlashCommandBuilder) and `execute(interaction)`.
3. Run `npm run register:guild` to register it.

```js
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  category: "utility",
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello!"),
  async execute(interaction) {
    await interaction.reply("Hello!");
  },
};
```

### Add a prefix command
1. Add an entry to a file in `commands/prefix/`.
2. Export with `name`, `description`, and `execute(message, args)`.

```js
module.exports = {
  name: "hello",
  description: "Say hello!",
  async execute(message) {
    await message.channel.send("Hello!");
  },
};
```

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a pull request.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
Made with ❤️ by the <a href="https://coopft.com">CoopFT</a> team.<br/>
Find more bots on the <a href="https://coopft.com/marketplace">CoopFT Marketplace</a>.
</div>
