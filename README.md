# CoopGuard

**CoopGuard** is CoopFT's slash-command moderation and server-protection bot, built on Discord.js.

## Features

- Moderation: kick, ban, warnings, timeouts, purge, channel locks and slowmode
- Auto-moderation controls for profanity, spam, links, invites, caps and mention spam
- Raid-mode controls and configurable mention limits
- Member notes, role management and moderation history
- Configurable moderation logs, audit-log lookup and server utilities
- Utility and fun commands

## Requirements

- Node.js 22 or newer
- A Discord application and bot token
- The `bot` and `applications.commands` OAuth2 scopes

CoopGuard uses Discord application commands. It does not support message-prefix commands and does not require the privileged Message Content intent.

## Setup

```bash
npm install
cp .env.example .env
```

Set the values required by your deployment:

```env
TOKEN=YOUR_BOT_TOKEN
CLIENT_ID=YOUR_APPLICATION_ID
DEV_GUILD_ID=
OWNER_IDS=
LOG_CHANNEL_ID=
MEMBER_ROLE_ID=
WARN_AUTOMUTE_LIMIT=3
DATABASE_URL=
```

Enable the **Server Members Intent** in the Developer Portal if you use member-join features. Grant only the bot permissions needed for the moderation actions you enable.

## Register slash commands

For a fast test registration, set `DEV_GUILD_ID` and run:

```bash
npm run check:commands
npm run register:guild
```

For global registration:

```bash
npm run deploy
```

Then start the bot:

```bash
npm start
```

## Example commands

`/ban`, `/kick`, `/warn`, `/mute`, `/warnings`, `/purge`, `/automod`, `/raidmode`, `/setmodlog`, and `/audit`.

Use `/help` in Discord to see the commands registered by the running bot.

## Project structure

- `commands/slash/` — slash-command modules
- `handlers/` — interaction, member and ready-event handlers
- `utils/` — moderation, permissions, settings and logging helpers
- `deploy-commands.js` — command schema validation and registration

## Notes

- Never commit your bot token or other secrets.
- Keep the bot's role above the roles it must moderate.
- Review default permissions and command access before inviting the bot to a production server.
