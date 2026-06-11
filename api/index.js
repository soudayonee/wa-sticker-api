const express = require("express");
const { Sticker } = require("wa-sticker-formatter");

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/api/sticker", async (req, res) => {
  try {
    const {
      imageBase64,
      author: reqAuthor,
      pack: reqPack,
      type: reqType,
      quality: reqQuality,
    } = req.body;

    const author = reqAuthor || "MaiSa";
    const pack = reqPack || "MaiSa Bot WhatsApp Assistant Kawaii";
    const type = reqType || "crop";
    const quality = reqQuality || 90;

    if (!imageBase64) {
      return res.status(400).json({ error: "Mana data gambarnya jir" });
    }

    const buffer = Buffer.from(imageBase64, "base64");
    const sticker = new Sticker(buffer, { author, pack, type, quality });
    const stickerBuffer = await sticker.toBuffer();

    res.setHeader("Content-Type", "image/webp");
    return res.send(stickerBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Servernya error nich" });
  }
});

module.exports = app;
