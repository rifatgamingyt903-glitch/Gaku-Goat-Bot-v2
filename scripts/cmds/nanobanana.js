const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "nanobanana",
    aliases: ["nb"],
    version: "1.0",
    author: "Saimx69x | API Renz",
    countDown: 5,
    role: 0,
    shortDescription: "Generate image using NanoBanana API",
    longDescription: "Generate an AI image based on your prompt using the NanoBanana API.",
    category: "image generator",
    guide: "{p}nanobanana [prompt]"
  },

  onStart: async function ({ api, event, args, message }) {
    const prompt = args.join(" ");
    if (!prompt) {
      return message.reply(
        "⚠️ Please provide a prompt to generate an image.\nExample: /nanobanana A cute cat wearing sunglasses"
      );
    }

    const processingMsg = await message.reply("⏳ Generating your image...");

    const imgPath = path.join(__dirname, "cache", `${Date.now()}_nanobanana.jpg`);
    const seed = 12345; 

    try {
      const apiURL = `https://dev.oculux.xyz/api/nanobanana?prompt=${encodeURIComponent(prompt)}&seed=${seed}`;
      const res = await axios.get(apiURL, { responseType: "arraybuffer" });

      await fs.ensureDir(path.dirname(imgPath));
      await fs.writeFile(imgPath, Buffer.from(res.data, "binary"));
      await api.unsendMessage(processingMsg.messageID);
      message.reply({
        body: `✅ Generated image for: "${prompt}"`,
        attachment: fs.createReadStream(imgPath)
      });

    } catch (err) {
      console.error("NanoBanana API Error:", err);
      await api.unsendMessage(processingMsg.messageID);
      message.reply("❌ Failed to generate image. Please try again later.");
    } finally {
      if (fs.existsSync(imgPath)) {
        await fs.remove(imgPath);
      }
    }
  }
};
