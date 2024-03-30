const express = require("express")
const spawner = require("child_process").spawn

const {IMAGE_FOLDER,PYTHON_FOLDER_IMAGE,MODEL_SOURCE } = require("../../constants/constants");

const router = express.Router()

router.get("/image",(req,res) => {
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

module.exports = router;