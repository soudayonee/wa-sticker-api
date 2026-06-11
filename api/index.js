const express = require("express");
const { Sticker } = require("wa-sticker-formatter");

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
  }),
);

app.post("/api/sticker", async (req, res) => {
  try {
    const { mediaBase64, pack, author, type, quality } = req.body;

    if (!mediaBase64) {
      return res.status(400).json({
        status: false,
        message: "mediaBase64 wajib diisi",
      });
    }

    const sticker = new Sticker(Buffer.from(mediaBase64, "base64"), {
      pack: pack || "MaiSa",
      author: author || "MaiSa Bot",
      type: type || "crop",
      quality: quality || 90,
    });

    const buffer = await sticker.toBuffer();

    res.setHeader("Content-Type", "image/webp");

    return res.send(buffer);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

module.exports = app;
