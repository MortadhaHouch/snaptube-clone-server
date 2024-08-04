let express = require('express');
let app = express();
let youtubeDL = require("ytdl-core")
let dotenv = require("dotenv");
let fs = require("fs");
let path = require("path");
const ytlist = require('youtube-playlist');
dotenv.config();
app.listen(process.env.PORT,()=>{
    console.log("server running on port " + process.env.PORT);
})
let bodyParser = require("body-parser")
let cookieParser = require("cookie-parser")
let cors = require("cors");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    // origin: process.env.CLIENT_URL,
    credentials: true,  // enable set cookie
    methods:["GET","POST","PUT","DELETE"]
}))
app.get("/",(req,res)=>{
    const videoURL = req.body.downloadURL;
    // Define the output file path
    const outputPath = path.join(__dirname, 'video.mp4');
    // Function to download video
    async function downloadVideo(url) {
        try {
            const info = await youtubeDL.getInfo(url);
            const format = youtubeDL.chooseFormat(info.formats, { quality: 'highest' });
            if (!format) {
                console.error('No suitable format found.');
                return;
            }
            console.log('Starting download...');
            youtubeDL(url, { format: format })
                .pipe(fs.createWriteStream(outputPath))
                .on('finish', () => {
                    console.log('Download completed!');
                })
                .on('error', err => {
                    console.error('Error writing file:', err);
                });
        } catch (err) {
            console.error('Error fetching video info:', err);
        }
    }
    // Start the download process
    downloadVideo(videoURL);
})