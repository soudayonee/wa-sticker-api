const ffmpegPath = require("ffmpeg-static");
require("fluent-ffmpeg").setFfmpegPath(ffmpegPath);

const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const { Sticker } = require("wa-sticker-formatter");

const app = express();

sharp.cache(false);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 4.5 * 1024 * 1024,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/sticker", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "File media wajib diunggah",
      });
    }

    const { pack, author, type, quality } = req.body;
    const mediaBuffer = req.file.buffer;

    const sticker = new Sticker(mediaBuffer, {
      pack: pack || "MaiSa",
      author: author || "MaiSa Bot",
      type: type || "crop",
      quality: quality ? parseInt(quality) : 90,
      width: 320,
      height: 320,
    });

    const buffer = await sticker.toBuffer();

    res.setHeader("Content-Type", "image/webp");
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
});

module.exports = app;
