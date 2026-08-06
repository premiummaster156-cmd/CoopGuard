const fs = require("fs");
const path = require("path");

// Simple JSON-file-backed store so moderation data survives restarts.
// Falls back to in-memory if no data dir is writable.

const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "store.json");

let memory = { warnings: {}, mutes: {}, notes: {}, settings: {}, levels: {} };

function load() {
  try {
    if (fs.existsSync(FILE)) {
      memory = { ...memory, ...JSON.parse(fs.readFileSync(FILE, "utf8")) };
    }
  } catch (err) {
    // ignore
  }
}

function save() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(memory, null, 2));
  } catch (err) {
    // ignore — run in-memory
  }
}

load();

module.exports = {
  // Warnings: { "guild-user": [{ id, reason, modId, date }] }
  addWarning(guildId, userId, reason, modId) {
    const key = `${guildId}-${userId}`;
    if (!memory.warnings[key]) memory.warnings[key] = [];
    const warn = { id: memory.warnings[key].length + 1, reason, modId, date: new Date().toISOString() };
    memory.warnings[key].push(warn);
    save();
    return warn;
  },
  getWarnings(guildId, userId) {
    return memory.warnings[`${guildId}-${userId}`] || [];
  },
  clearWarnings(guildId, userId) {
    const key = `${guildId}-${userId}`;
    const count = (memory.warnings[key] || []).length;
    delete memory.warnings[key];
    save();
    return count;
  },
  removeWarning(guildId, userId, id) {
    const key = `${guildId}-${userId}`;
    const list = memory.warnings[key] || [];
    const filtered = list.filter((w) => w.id !== id);
    if (filtered.length === list.length) return false;
    memory.warnings[key] = filtered;
    save();
    return true;
  },
  // Mutes: { "guild-user": { until, by, reason } }
  setMute(guildId, userId, until, by, reason) {
    memory.mutes[`${guildId}-${userId}`] = { until, by, reason };
    save();
  },
  getMute(guildId, userId) {
    return memory.mutes[`${guildId}-${userId}`] || null;
  },
  removeMute(guildId, userId) {
    delete memory.mutes[`${guildId}-${userId}`];
    save();
  },
  // Notes: { "guild-user": [{ text, modId, date }] }
  addNote(guildId, userId, text, modId) {
    const key = `${guildId}-${userId}`;
    if (!memory.notes[key]) memory.notes[key] = [];
    memory.notes[key].push({ text, modId, date: new Date().toISOString() });
    save();
  },
  getNotes(guildId, userId) {
    return memory.notes[`${guildId}-${userId}`] || [];
  },
  // Guild settings: { guildId: { ... } }
  getSettings(guildId) {
    return memory.settings[guildId] || {};
  },
  setSetting(guildId, key, value) {
    if (!memory.settings[guildId]) memory.settings[guildId] = {};
    memory.settings[guildId][key] = value;
    save();
  },
  getAllSettings() {
    return memory.settings;
  },
  // Levels: { "guild-user": { xp, level } }
  addXp(guildId, userId, amount) {
    const key = `${guildId}-${userId}`;
    if (!memory.levels[key]) memory.levels[key] = { xp: 0, level: 0 };
    memory.levels[key].xp += amount;
    const newLevel = Math.floor(memory.levels[key].xp / 100);
    const leveledUp = newLevel > memory.levels[key].level;
    memory.levels[key].level = newLevel;
    save();
    return { ...memory.levels[key], leveledUp };
  },
  getLevel(guildId, userId) {
    return memory.levels[`${guildId}-${userId}`] || { xp: 0, level: 0 };
  },
  getLeaderboard(guildId) {
    const entries = Object.entries(memory.levels)
      .filter(([k]) => k.startsWith(`${guildId}-`))
      .map(([k, v]) => ({ userId: k.split("-")[1], ...v }))
      .sort((a, b) => b.xp - a.xp);
    return entries;
  },
};
