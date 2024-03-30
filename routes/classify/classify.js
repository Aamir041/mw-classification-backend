const express = require("express");
const spawner = require("child_process").spawn;
const {v4:uuid4} = require("uuid");
const multer = require("multer");

const {IMAGE_FOLDER,PYTHON_FOLDER_IMAGE,MODEL_SOURCE } = require("../../constants/constants");

const router = express.Router()

const storage = multer.diskStorage(
    {
        destination: function(req,file,callback) {
            return callback(null,"./images");
        },
        filename: function(req, file, callback){
            const fileName = file.originalname;
            const dotIndex = fileName.indexOf(".");
            const raw_file = fileName.substring(0,dotIndex);
            const fileType = fileName.substring(dotIndex+1,fileName.length)
            const uploadFileName = `${raw_file}_${uuid4()}.${fileType}`
            return callback(null,uploadFileName)
        }
    }
)

const upload = multer({storage})

router.get("/image",async (req,res) => {
    const python_process = spawner("python",[`${PYTHON_FOLDER_IMAGE}`,`${MODEL_SOURCE}`,`${IMAGE_FOLDER}/image5.jpg`])

    let result;
    python_process.stdout.on('data',(data)=>{
        result = JSON.parse(data.toString());
        console.log("[ output from script ] :: ",JSON.parse(data.toString()))
    })

    python_process.on('close',() => {
        res.send(result);
    })
})

router.post("/upload",upload.single('file'),async (req,res) => {
    return res.status(200).send({message:"uploaded"});
})

module.exports = router;