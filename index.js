const express = require("express");
const app = express();
const classify = require("./routes/classify");
const hospital = require("./routes/hospital");
const report = require("./routes/report");
const users = require("./routes/users");
const cors = require("cors");
const swaggerJSDOc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./configs/swaggerConfig");
const passport = require("passport");
const swaggerSpec = swaggerJSDOc(swaggerOptions);
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./models/dbConn").user;
const {SECRET_KEY} = require("./constants/constants");

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

const PORT = 8080;

app.use("/classify",classify);
app.use("/hospital",hospital);
app.use("/users",users);
app.use("/report", report);

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;

passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
        const user = await User.findOne({ where: { id: jwt_payload.identifier.id } });

        // If user exists then login
        if (user) {
            return done(null, user);
        } 
        // else send unauthorized 
        else {
            return done(null, false);
        }
    })
);

/**
 * @swagger
 * /:
 *  get:
 *      responses:
 *          200:
 *              description: to test application is up or not
 *              content:
 *                  application/text:
 *                      example:
 *                          Hi
 *          
 */

app.get("/",async (req,res)=>{
    res.send("I am groot.");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})