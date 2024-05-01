const express = require("express");
const app = express();
const classify = require("./routes/classify");
const hospital = require("./routes/hospital");
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

app.use(cors());
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec));
app.use(express.json());

const PORT = 8080;

app.use("/classify",classify);
app.use("/hospital",hospital);
app.use("/users",users)

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "mwapp";

passport.use(
    new JwtStrategy(opts, function(jwt_payload, done) {
        User.findOne({id:jwt_payload.identifier}, function(err, user) {
            if(err){
                return done(err,false);
            }
            if(user){
                return (null, user);
            } else{
                return(null, false);
            }
        })
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
    res.send("Hi");
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})