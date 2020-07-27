const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());

app.get('/download/:format', async (req, res) => {
  try {
    if (!["mp3", "mp4"].includes(req.params.format)) return res.json({status: "Failed", message: "Invalid format"});
    if (!req.query.url) return res.json({status: "Failed", message: "Unknown querys"})
    if (!ytdl.validateURL(req.query.url)) return res.json({status: "Failed", message: "Invalid url"});

    let downloadOptions = { format: req.params.format.toLowerCase() };

    if (req.params.format.toLowerCase() === "mp4") {
      Object.assign(downloadOptions, {
        format: "audioonly"
      });
    }

    const basicInfo = await ytdl.getBasicInfo(req.query.url);

    res.header('Content-Disposition', `attachment; filename="${basicInfo.videoDetails.title}.${req.params.format.toLowerCase()}"`);
    await ytdl(req.query.url, downloadOptions).pipe(res)

  } catch (err) {
    console.log(err);
    return res.json({
      status: "Failed",
      message: "A error occurred"
    })
  }
})

app.listen(4000, () => {
  console.log("Listening on port 4000")
})
