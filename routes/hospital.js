const express = require("express");
const router = express.Router();

const db = require("../models/dbConn");
const Hospital = db.hospital;

router.post("/create", async (req, res) => {

    const { name } = req.body

    const hospital_details = {
        hospital_name: name
    }

    const isHospitalPresent = await Hospital.count({
        where: {
            hospital_name: name
        }
    })

    if (isHospitalPresent > 0) {
        const hospitalExistRes = {
            message: "Hospital name already exists!",
            status: 400 
        }
        res.status(400).send(hospitalExistRes)
    }
    else {
        const createHospital =  await Hospital.create(hospital_details);
        console.log("Hospital Created Successfully");
        res.status(200).send(createHospital);
    }

})

module.exports = router;