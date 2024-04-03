const express = require("express");
const { spawn: spawner } = require("child_process");
const { v4: uuid4 } = require("uuid");
const multer = require("multer");

const {
    IMAGE_FILE,
    PYTHON_FILE,
    MODEL
} = require("../../constants/constants");

const router = express.Router()

let fileName; // stores uploaded file name

// configs for saving the file
const storage = multer.diskStorage(
    {
        // sets the destination in which file is gonna be uploaded
        destination: function (req, file, callback) {
            return callback(null, "./images");
        },
        filename: function (req, file, callback) {
            // Get file name, its type add uuid to and set the file name in global variable
            fileName = null;
            const file_name = file.originalname;
            const dotIndex = file_name.indexOf(".");
            const raw_file = file_name.substring(0, dotIndex);
            const fileType = file_name.substring(dotIndex + 1, file_name.length)
            const uploadFileName = `${raw_file}_${uuid4()}.${fileType}`
            fileName = uploadFileName;
            return callback(null, uploadFileName)
        }
    }
)

const upload = multer({ storage })

/**
 * @swagger
 * /classify/image:
 *  post:
 *      responses:
 *          200:
 *              description: Successful classification
 *              content:
 *                  application/json:
 *                      example:
 *                          result: [{"item":"medical_cap","prob":0.95}]
 *                          status: "ok"
 *          400:
 *              description: When an error occurs while execution python script
 *              content:
 *                  application/json:
 *                      example:
 *                          result: "An error occured while classifying!"
 *                          status: "error"
 */

router.post("/image", upload.single('file'), async (req, res) => {

    console.log("Starting ....")

    // runs python script
    const python_process = spawner("python", [`${PYTHON_FILE}`, `${MODEL}`, `${IMAGE_FILE}/${fileName}`])

    let result;
    // fetches data from python script
    python_process.stdout.on('data', (data) => {
        result = JSON.parse(data.toString());
        console.log("[ output from script ] :: ", JSON.parse(data.toString()))
    })

    // send the data fetched from python script  
    python_process.on('close', () => {
        if(result?.status != "ok"){
            res.status(400).send(result);
            console.log("Failed ....")
        }
        else{
            res.status(200).send(result);
            console.log("Success ....")
        }
        console.log("Finished !");
    })
    fileName = null;

})

module.exports = router;