const express = require("express")
const router = express.Router();

const db = require("../models/dbConn");
const passport = require("passport");
const json2csv = require("json-2-csv");
const Waste = db.waste;
const Hospital = db.hospital;
const {HOSPITAL_DOES_NOT_EXISTS}= require("../constants/constants");
const { getHospitalIdFromToken } = require("../utils/helpers");

router.get(
    ("/generate"), 
    passport.authenticate("jwt",{session:false}),
    async(req, res) => {
        
        const bearerToken = req.headers.authorization;
        const hospital_id = await getHospitalIdFromToken(bearerToken);;

        const hospital = await Hospital.findOne(
            {
                where : {
                    hospital_id: hospital_id
                }
            }
        );
        
        if(!hospital){
            res.status(404).send(HOSPITAL_DOES_NOT_EXISTS)
        }

        const waste = await Waste.findAll(
            {
                where:{
                    hospital_id: hospital_id
                }
            }
        )

        res.status(200).send(waste);

    }
);


module.exports = router;