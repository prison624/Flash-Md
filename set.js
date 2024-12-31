const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic0c0UHlwS1hKelhyNWxNSGZGYytyOS96dEtJSnZQenJYeWhwNE9IM0RtQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYW56b09ncUxKZFRIZjg2Tk1RTjhXSWFZOWdiR0ZsaWdzSnU3SVc3N054VT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJnTzc5cnhodmh3NnpuMk5EWTlzcjVsdHpYYmQ3YVlrSW4xcHNjVlhQZWxjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJYQzA0c1VlS3pMNFBLVVZQTVVlcEZlS2pQZXo3cFh4R1o2RmlCTURJNzNRPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdCZDlOdjAydklENWNSRjhGTEEvSk83bzkyNHVwK3NCb2NmZkp5V1c1RUE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjRXaXlvcDRYVmM0bjRYMGRYZWJMdjU1dlhvbG9oa21RdTVCd0x4YXVuREE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOE16T2gzd3ZDM0dWTVBBNTdpNW1CRVA1L0hENGZ6d1QvRVArZUt6YXBIaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY2dITlFVbVdVWFRlOTRoTm5SS3pwWEtVNm1QR1I4WE9tY2pJM3Qrdk1naz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1JVmxtNklqWXhQS2V6RFBVSmxZcW9jNUxWekxyb3ZKN2dUcHpYQmNLZExJRkJsK29yajhIMXkxVUo3VXRtcnJ5NlpGRTNrOVN1UmlTNVBNS0I4cEJ3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTQxLCJhZHZTZWNyZXRLZXkiOiJqNzlWQVpOU1hYMGJTVnYxcURmYXE0QlBva2pncHdiaUk2eEtEU0RmM0hBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiIzSm00ekxYdFFwaUdBOTVCNlhCQi13IiwicGhvbmVJZCI6IjFlMmJkNjAxLTViYjEtNGI2Mi1hZTgxLWEwMjA1NzcxNTYwZSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJkbG4rcytQeWF4ZE1pUEFDZVFQZVU2RXJ3a2c9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNHRQUEZ5OHo0TW42MUJqSlNGU1h2a0FuTlRNPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkNYUkQ0TExIIiwibWUiOnsiaWQiOiI1MDkzNDQwMzE1Mjo0MUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDT0NFOWVnSEVJeXgwTHNHR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5Ijoidjh1aERPTUFoM1RLMFkrVHF3OVY5ZitYL2hMTHJPcm55VlRMYzJrUU1odz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiV3dlT1FBYmNGOFd0Q2ZXMm1Ma01zb3NwT1RqUmxlTGVHS2cvalJuL054Q3Vnd2QvQ29NMHhURHFTS3lOOHVqK3hNaFM2K2RRZjBhOGwrZDBJVWV5RHc9PSIsImRldmljZVNpZ25hdHVyZSI6ImhLWVZDaUZMTEd5YnFkb2VFK0hWK1FheDU4bWhIK1l4ZllqWG53cjdhR3llTmVORkZuei9LMFJDL2duTFBBMkRNU0xoNHN4bTdaaWQxNGhxT2VRaUJBPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiNTA5MzQ0MDMxNTI6NDFAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCYi9Mb1F6akFJZDB5dEdQazZzUFZmWC9sLzRTeTZ6cTU4bFV5M05wRURJYyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTczNTY2MTcyMX0=>',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "

✭🍷⍣⃝𝐔𝚪_𝐂𝚪𝐔𝐒𝚮 𝐊𝚫𝐋𝚫𝐒𝚮𝐘🌹✮⃝👑✭🌹`",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "50934403152",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "on",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'on',
    L_S: process.env.STATUS_LIKE || 'on',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
