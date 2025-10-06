const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "tiktok",
    aliases: ["ttdl", "tikdl"],
    version: "1.0",
    author: "Mueid Mursalin Rifat",
    countDown: 5,
    role: 0,
    shortDescription: "Download TikTok video by URL",
    longDescription: "Downloads TikTok videos with or without watermark using Cat-X API.",
    category: "media",
    guide: {
      en: "{p}tiktok <video_url>"
    }
  },

  onStart: async function({ api, event, args }) {
    const url = args[0];
    if (!url) return api.sendMessage("⚠️ | Please provide a valid TikTok URL.\nExample: tiktok https://www.tiktok.com/@user/video/1234567890", event.threadID, event.messageID);

    const apiUrl = `https://mmr-cat-x-api.onrender.com/api/tikdl?url=${encodeURIComponent(url)}`;
    const tempPath = path.join(__dirname, "cache", `tiktok_${Date.now()}.mp4`);

    try {
      const res = await axios.get(apiUrl);
      const data = res.data;

      if (!data || !data.downloadLink) {
        return api.sendMessage("❌ | Failed to fetch video. Please check the TikTok link or try again later.", event.threadID, event.messageID);
      }

      // Download the video
      const video = await axios.get(data.downloadLink, { responseType: "arraybuffer" });
      fs.writeFileSync(tempPath, Buffer.from(video.data, "binary"));

      const caption = `
🎬 𝗧𝗶𝗸𝗧𝗼𝗸 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿  
━━━━━━━━━━━━━━━  
👤 Author: ${data.author || "Unknown"}  
🧑‍💻 Operator: ${data.operator || "Mueid Mursalin Rifat"}  
📝 Description: ${data.description || "No caption"}  
❤️ Likes: ${data.likes || "0"}  
💬 Comments: ${data.comments || "0"}  
━━━━━━━━━━━━━━━  
🎧 MP3: ${data.mp3DownloadLink ? "Available ✅" : "Unavailable ❌"}
      `;

      api.sendMessage({
        body: caption,
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, () => fs.unlinkSync(tempPath), event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ | Error fetching TikTok video. Please try again later.", event.threadID, event.messageID);
    }
  }
};
