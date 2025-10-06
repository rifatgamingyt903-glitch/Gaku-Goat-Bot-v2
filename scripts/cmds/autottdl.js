const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "autotikdl",
    version: "4.0",
    author: "Mueid Mursalin Rifat",
    countDown: 0,
    role: 0,
    shortDescription: "Auto TikTok downloader",
    longDescription: "Automatically detects TikTok links and downloads videos using Cat-X API.",
    category: "media",
    guide: {
      en: "Just send or paste any TikTok link — bot will automatically download the video."
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const body = event.body || "";
      const tiktokRegex = /(https?:\/\/(?:www\.|m\.|vm\.|vt\.|t\.)?tiktok\.com\/[^\s]+)/gi;
      const match = body.match(tiktokRegex);
      if (!match) return;

      const tikUrl = match[0];
      const apiUrl = `https://mmr-cat-x-api.onrender.com/api/tikdl?url=${encodeURIComponent(tikUrl)}`;
      api.sendMessage("📥 | Fetching TikTok video, please wait...", event.threadID, event.messageID);

      const { data } = await axios.get(apiUrl);

      if (!data || !data.downloadLink) {
        return api.sendMessage("❌ | No downloadable video found.", event.threadID, event.messageID);
      }

      const videoUrl = data.downloadLink;
      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);
      const videoPath = path.join(cacheDir, `tiktok_${Date.now()}.mp4`);

      const videoStream = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Referer": "https://www.tiktok.com/"
        }
      });

      const writer = fs.createWriteStream(videoPath);
      videoStream.data.pipe(writer);

      writer.on("finish", () => {
        const caption = `
🎬 𝗧𝗶𝗸𝗧𝗼𝗸 𝗩𝗶𝗱𝗲𝗼
━━━━━━━━━━━━━━━━━━
👤 Author: ${data.author || "Unknown"}
🧑‍💻 Operator: ${data.operator || "Mueid Mursalin Rifat"}
📝 Description: ${data.description || "No description"}
❤️ Likes: ${data.likes || "0"}   💬 Comments: ${data.comments || "0"}
━━━━━━━━━━━━━━━━━━
        `.trim();

        api.sendMessage({
          body: caption,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);
      });

      writer.on("error", err => {
        console.error("Stream write error:", err);
        api.sendMessage("⚠️ | Error saving TikTok video.", event.threadID, event.messageID);
      });

    } catch (err) {
      console.error("Auto TikTok DL Error:", err.message);
      api.sendMessage("⚠️ | Error downloading TikTok video.", event.threadID, event.messageID);
    }
  }
};const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "autotikdl",
    version: "4.0",
    author: "Mueid Mursalin Rifat",
    countDown: 0,
    role: 0,
    shortDescription: "Auto TikTok downloader",
    longDescription: "Automatically detects TikTok links and downloads videos using Cat-X API.",
    category: "media",
    guide: {
      en: "Just send or paste any TikTok link — bot will automatically download the video."
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const body = event.body || "";
      const tiktokRegex = /(https?:\/\/(?:www\.|m\.|vm\.|vt\.|t\.)?tiktok\.com\/[^\s]+)/gi;
      const match = body.match(tiktokRegex);
      if (!match) return;

      const tikUrl = match[0];
      const apiUrl = `https://mmr-cat-x-api.onrender.com/api/tikdl?url=${encodeURIComponent(tikUrl)}`;
      api.sendMessage("📥 | Fetching TikTok video, please wait...", event.threadID, event.messageID);

      const { data } = await axios.get(apiUrl);

      if (!data || !data.downloadLink) {
        return api.sendMessage("❌ | No downloadable video found.", event.threadID, event.messageID);
      }

      const videoUrl = data.downloadLink;
      const cacheDir = path.join(__dirname, "cache");
      fs.ensureDirSync(cacheDir);
      const videoPath = path.join(cacheDir, `tiktok_${Date.now()}.mp4`);

      const videoStream = await axios({
        method: "GET",
        url: videoUrl,
        responseType: "stream",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Referer": "https://www.tiktok.com/"
        }
      });

      const writer = fs.createWriteStream(videoPath);
      videoStream.data.pipe(writer);

      writer.on("finish", () => {
        const caption = `
🎬 𝗧𝗶𝗸𝗧𝗼𝗸 𝗩𝗶𝗱𝗲𝗼
━━━━━━━━━━━━━━━━━━
👤 Author: ${data.author || "Unknown"}
🧑‍💻 Operator: ${data.operator || "Mueid Mursalin Rifat"}
📝 Description: ${data.description || "No description"}
❤️ Likes: ${data.likes || "0"}   💬 Comments: ${data.comments || "0"}
━━━━━━━━━━━━━━━━━━
        `.trim();

        api.sendMessage({
          body: caption,
          attachment: fs.createReadStream(videoPath)
        }, event.threadID, () => fs.unlinkSync(videoPath), event.messageID);
      });

      writer.on("error", err => {
        console.error("Stream write error:", err);
        api.sendMessage("⚠️ | Error saving TikTok video.", event.threadID, event.messageID);
      });

    } catch (err) {
      console.error("Auto TikTok DL Error:", err.message);
      api.sendMessage("⚠️ | Error downloading TikTok video.", event.threadID, event.messageID);
    }
  }
};
