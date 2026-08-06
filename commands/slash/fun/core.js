const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../../../config");
const { success, error, info } = require("../../../utils/embed");

// Simple deterministic pseudo-random helpers (no external deps)
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function flip() { return Math.random() < 0.5; }

const RATES = [
  "Looks great! 🟢",
  "Pretty solid! ✅",
  "Decent, but could use work. 🟡",
  "Not great... 🔴",
  "Absolutely stunning! 🌟",
  "It's a 10/10 from me.",
  "I'm impressed. 👍",
  "Needs more effort. 😬",
  "That's a masterpiece! 🎨",
  "Meh. 😐",
];

module.exports = [
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("8ball")
      .setDescription("Ask the magic 8-ball a question.")
      .addStringOption((o) => o.setName("question").setDescription("Your question").setRequired(true)),
    async execute(interaction) {
      const q = interaction.options.getString("question");
      const answers = ["Yes", "No", "Maybe", "Definitely", "Ask again later", "Cannot predict now", "Without a doubt", "Don't count on it", "Outlook good", "Signs point to yes"];
      await interaction.reply({ embeds: [info("🎱 8-Ball", `**Q:** ${q}\n\n**A:** ${rand(answers)}`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("coinflip")
      .setDescription("Flip a coin."),
    async execute(interaction) {
      await interaction.reply({ embeds: [success("🪙 Coin Flip", `You got **${flip() ? "Heads" : "Tails"}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("diceroll")
      .setDescription("Roll a die.")
      .addIntegerOption((o) => o.setName("sides").setDescription("Number of sides (default 6)")),
    async execute(interaction) {
      const sides = interaction.options.getInteger("sides") || 6;
      const result = Math.floor(Math.random() * sides) + 1;
      await interaction.reply({ embeds: [success(`🎲 Dice (d${sides})`, `You rolled **${result}**!`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("rate")
      .setDescription("Rate something out of 10.")
      .addStringOption((o) => o.setName("thing").setDescription("What to rate").setRequired(true)),
    async execute(interaction) {
      const thing = interaction.options.getString("thing");
      const score = Math.floor(Math.random() * 11);
      await interaction.reply({ embeds: [info("⭐ Rating", `I rate **${thing}** a **${score}/10**. ${rand(RATES)}`)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("say")
      .setDescription("Make the bot say something in the channel.")
      .addStringOption((o) => o.setName("text").setDescription("Text to say").setRequired(true)),
    async execute(interaction) {
      const text = interaction.options.getString("text");
      await interaction.reply({ content: text });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("joke")
      .setDescription("Get a random joke."),
    async execute(interaction) {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything!",
        "I told my wife she should embrace her mistakes. She hugged me.",
        "Why did the scarecrow win an award? Because he was outstanding in his field!",
        "What do you call a fake noodle? An impasta!",
        "Why don't skeletons fight each other? They don't have the guts.",
        "I'm reading a book on anti-gravity. It's impossible to put down!",
        "What do you call a bear with no teeth? A gummy bear!",
        "Why can't your nose be 12 inches long? Because then it would be a foot.",
        "What do you call a fish with no eyes? A fsh!",
        "Why did the bicycle fall over? Because it was two-tired!",
      ];
      await interaction.reply({ embeds: [success("😂 Joke", rand(jokes))] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("meme")
      .setDescription("Get a random meme (placeholder)."),
    async execute(interaction) {
      await interaction.reply({ embeds: [info("🖼️ Meme", "Meme support requires a meme API key. Here's a placeholder:\n\n**When the server is quiet at 3am but you're still online** 😴")] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("avatarfun")
      .setDescription("Get a fun enlarged avatar.")
      .addUserOption((o) => o.setName("user").setDescription("The user")),
    async execute(interaction) {
      const user = interaction.options.getUser("user") || interaction.user;
      const embed = new EmbedBuilder().setTitle(`${user.tag}`).setColor(config.colors.primary).setImage(user.displayAvatarURL({ size: 1024 }));
      await interaction.reply({ embeds: [embed] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("reverse")
      .setDescription("Reverse a string.")
      .addStringOption((o) => o.setName("text").setDescription("Text to reverse").setRequired(true)),
    async execute(interaction) {
      const text = interaction.options.getString("text");
      await interaction.reply({ embeds: [info("🔁 Reversed", text.split("").reverse().join(""))] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("zerothumb")
      .setDescription("Give a user a thumbs up."),
    async execute(interaction) {
      await interaction.reply({ embeds: [success("👍", "Thumbs up!")] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("ship")
      .setDescription("Check compatibility between two users.")
      .addUserOption((o) => o.setName("user1").setDescription("First user").setRequired(true))
      .addUserOption((o) => o.setName("user2").setDescription("Second user").setRequired(true)),
    async execute(interaction) {
      const u1 = interaction.options.getUser("user1");
      const u2 = interaction.options.getUser("user2");
      const score = Math.floor(Math.random() * 101);
      const bar = "█".repeat(Math.floor(score / 10)) + "░".repeat(10 - Math.floor(score / 10));
      await interaction.reply({ embeds: [info("💘 Ship", `${u1} ❤️ ${u2}\n\n**Compatibility: ${score}%**\n\`${bar}\``)] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("catfact")
      .setDescription("Get a random cat fact."),
    async execute(interaction) {
      const facts = [
        "Cats sleep 70% of their lives.",
        "A cat's nose print is as unique as a human's fingerprint.",
        "Cats can't taste sweetness.",
        "A group of cats is called a clowder.",
        "Cats have 32 muscles in each ear.",
        "A cat can jump up to 6 times its body length.",
        "Cats spend about 1/3 of their waking hours grooming.",
        "The oldest known pet cat was found in a 9,500-year-old grave.",
      ];
      await interaction.reply({ embeds: [success("🐱 Cat Fact", rand(facts))] });
    },
  },
  {
    category: "fun",
    data: new SlashCommandBuilder()
      .setName("roast")
      .setDescription("Roast a user (lightly).")
      .addUserOption((o) => o.setName("user").setDescription("The user to roast").setRequired(true)),
    async execute(interaction) {
      const user = interaction.options.getUser("user");
      const roasts = [
        "You're the reason the gene pool needs a lifeguard.",
        "I'd agree with you but then we'd both be wrong.",
        "You're not dumb. You just have bad luck thinking.",
        "You bring everyone so much joy—when you leave.",
        "You're like a software update. Whenever I see you I immediately postpone.",
        "I'd tell you to go outside, but the sun doesn't want that either.",
      ];
      await interaction.reply({ embeds: [info("🔥 Roast", `${user}, ${rand(roasts)}`)] });
    },
  },
];
