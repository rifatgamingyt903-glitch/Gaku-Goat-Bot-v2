const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const platforms = [
  "YouTube", "Facebook", "TikTok", "Instagram", "CapCut", "Likee", 
  "Spotify", "Terabox", "Twitter", "Google Drive", "SoundCloud", "NDown", "Pinterest"
];

const linkRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/)|youtu\.be\/|facebook\.com\/|fb\.watch\/|tiktok\.com\/|instagram\.com\/(reel|tv|stories)\/|capcut\.com\/|likee\.com\/|spotify\.com\/|terabox\.com\/|twitter\.com\/|drive\.google\.com\/|soundcloud\.com\/|ndown\.app\/|pinterest\.com\/|pin\.it\/)/i;

module.exports = {
  config: {
    name: "autodl",
    version: "2.0",
    author: "Saimx69x",
    role: 0,
    shortDescription: "All-in-one video/media downloader",
    longDescription: `Download videos/media from: ${platforms.join(", ")}`,
    category: "utility",
    guide: { en: "Send a supported media link to auto-download" }
  },

  onStart: async function({ api, event }) {
    api.sendMessage("Send a supported media link (YouTube/Facebook/TikTok/Instagram/Pinterest/...) to auto-react and download.", event.threadID, event.messageID);
  },

  onChat: async function({ api, event }) {
    const content = event.body ? event.body.trim() : '';
    if (content.toLowerCase().startsWith("auto")) return;
    if (!linkRegex.test(content)) return;

    api.setMessageReaction("⌛️", event.messageID, () => {}, true);

    try {
      let mediaTitle = "Unknown Title";
      let mediaURL;
      let extension = "mp4"; 

      if (/pinterest\.com|pin\.it/i.test(content)) {
        const PIN_API = `https://xsaim8x-xxx-api.onrender.com/api/auto?url=${encodeURIComponent(content)}`;
        const res = await axios.get(PIN_API);

        if (res.data && res.data.high_quality) {
          mediaURL = res.data.high_quality;
          mediaTitle = res.data.title || mediaTitle;
        } else throw new Error("Pinterest video not found");
      } else {
      
        const API = `https://xsaim8x-xxx-api.onrender.com/api/auto?url=${encodeURIComponent(content)}`;
        const res = await axios.get(API);
        if (res.data && (res.data.high_quality || res.data.low_quality)) {
          mediaURL = res.data.high_quality || res.data.low_quality;
          mediaTitle = res.data.title || mediaTitle;
        } else throw new Error("Media not found");
      }

      if (!mediaURL) throw new Error("No media URL found");

      const mediaBuffer = (await axios.get(mediaURL, { responseType: "arraybuffer" })).data;
      const filePath = path.join(__dirname, "cache", `auto_media_${Date.now()}.${extension}`);
      await fs.ensureDir(path.dirname(filePath));
      fs.writeFileSync(filePath, Buffer.from(mediaBuffer));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      const infoCard = 
`━━━━━━━━━━━━━━
𝐌𝐞𝐝𝐢𝐚 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝𝐞𝐝 ✅
╭─╼━━━━━━━━╾─╮
│ Title      : ${mediaTitle}
│ Status     : Success
│ Link       : ${content}
╰─━━━━━━━━━╾─╯
━━━━━━━━━━━━━━
Made with ❤️ by Saimx69x.`;

      api.sendMessage({
        body: infoCard,
        attachment: fs.createReadStream(filePath)
      }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (error) {

      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage(
        `━━━━━━━━━━━━━━
❌ | Failed to download media
━━━━━━━━━━━━━━
Error: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
