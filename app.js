let fs = require('fs');
let ytdl = require('ytdl-core');
let express = require('express');
let app = express();
let downloader = ytdl;
app.get('/convert/:videoId/:format', (req, res, next) => {
    var videoId = req.params['videoId'];
    var saveFormat = null;
    var convertFormat = null;
    if (req.params['format'] == "Video")
    {
        convertFormat = "audioandvideo";
        saveFormat = "mp4";
    }
    else if (req.params['format'] == "Audio")
    {
        convertFormat = "audioonly";
        saveFormat = "mp3";
    }
    else
    {
        res.json({error: true});
        return;
    }
    downloader.getInfo(videoId, (err, info) => {
        if (err){
            res.json({error: true});
        }
        if (ytdl.chooseFormat(info.formats, { quality: '134' })) {
            var savePath = `downloads/${Math.random().toString(36).substring(7)}.${saveFormat}`;
            const download = downloader(`http://www.youtube.com/watch?v=${videoId}`, { quality:"highest",filter: convertFormat });
            download.pipe(fs.createWriteStream(savePath));         
            download.on('end', () => {
                res.json({error: false, filePath: savePath, title: info.player_response.videoDetails.title});
            });
        }
        else
        {
            res.json({error: true});
        }
    });
});
app.use('/downloads', express.static('downloads'))
app.listen(3000, '0.0.0.0');
