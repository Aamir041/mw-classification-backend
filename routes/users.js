const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../models/dbConn");
const User = db.user;
const Hospital = db.hospital;

const { getTokens } = require("../utils/helpers");

const {
    USER_ALREADY_EXISTS,
    SALT,
    HOSPITAL_DOES_NOT_EXISTS,
    USER_NOT_FOUND,
    WRONG_PASSWORD,
    USERNAME_CANNOT_BE_NULL,
    PASSWORD_CANNOT_BE_NULL
} = require("../constants/constants");


/**
 * @swagger
 * components:
 *   schemas:
 *     SignUpUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - hospital_id
 *       properties:
 *         username:
 *           type: string
 *           description: The auto-generated id of the book
 *         password:
 *           type: string
 *           description: The title of your book
 *         hospital_id:
 *           type: number
 *           description: The book author
 *       example:
 *         username: aamir
 *         password: aamir@123
 *         hospital_id: 1
 *     LoginUser:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: The auto-generated id of the book
 *         password:
 *           type: string
 *           description: The title of your book
 *       example:
 *         username: aamir
 *         password: aamir@123
 */

/**
 * @swagger
 * /users/signup:
 *  post:
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/SignUpUser'
 *      responses:
 *          200:
 *              description: Successful Signup
 *              content:
 *                  application/json:
 *                      example:
 *                          id: 22
 *                          username: "maryam"
 *                          hospital_id: 10
 *                          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjp7ImlkIjoyMiwidXNlcm5hbWUiOiJtYXJ5YW0iLCJob3NwaXRhbF9pZCI6MTB9LCJpYXQiOjE3MTU0NDY0MzV9.WOpw-o-1DRZpL0gdbT-X5clwmbb25TEDMcYDKG8XjVc"
 *          400:
 *              description: When user already exsists
 *              content:
 *                  application/json:
 *                      example:
 *                          message: "User already exists"
 *                          status: 400
*          404:
 *              description: When Hospital does not exists
 *              content:
 *                  application/json:
 *                      example:
 *                          message: "Hospital does not exists"
 *                          status: 404
 */

router.post("/signup", async (req, res) => {

    const { username, password, hospital_id } = req.body;

    console.log("Creating a user...");

    const user = await User.findOne(
        {
            where: {
                username: username
            }
        }
    );

    const hospital = await Hospital.findOne(
        {
            where: {
                hospital_id: hospital_id
            }
        }
    );

    // if user exits with same username already then 
    if (user) {
        console.log("User already exists! : ", username);
        res.status(400).send(USER_ALREADY_EXISTS);
    }

    // if hospital does not exists then send error message
    if (hospital == null) {
        console.log("Hospital does not exists!");
        res.status(404).send(HOSPITAL_DOES_NOT_EXISTS)
    }

    if (!user && hospital) {

        // hash the password
        const hashedPassword = await bcrypt.hash(password, SALT);

        const userToSave = {
            username: username,
            password: hashedPassword,
            hospital_id: hospital_id
        }

        // create user in db
        const newUser = await User.create(userToSave);

        console.log("User created successfully!");

        const token = await getTokens(newUser);

        const userToReturn = { ...newUser.toJSON(), token }

        delete userToReturn.password;

        // send user info after saving
        res.status(201).json(userToReturn)
    }
});

/**
 * @swagger
 * /users/login:
 *  post:
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/LoginUser'
 *      responses:
 *          200:
 *              description: Successful Signup
 *              content:
 *                  application/json:
 *                      example:
 *                          id: 22
 *                          username: "maryam"
 *                          hospital_id: 10
 *                          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWVyIjp7ImlkIjoyMiwidXNlcm5hbWUiOiJtYXJ5YW0iLCJob3NwaXRhbF9pZCI6MTB9LCJpYXQiOjE3MTU0NDY0MzV9.WOpw-o-1DRZpL0gdbT-X5clwmbb25TEDMcYDKG8XjVc"
 *          401:
 *              description: When wrong password
 *              content:
 *                  application/json:
 *                      example:
 *                          message: "User wrong password"
 *                          status: 401
 *          400:
 *              description: "Username cannot be null"
 *              content:
 *                  application/json:
 *                      example:
 *                          message: "Username cannot be null / Password cannot null" 
 *                          status: 400 
 *          404:
 *              description: User not found
 *              content:
 *                  application/json:
 *                      example:
 *                          message: "User not found"
 *                          status: 404
 */

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if(username == null){
        res.status(400).send(USERNAME_CANNOT_BE_NULL);
        return;
    }
    
    if(password == null){
        res.status(400).send(PASSWORD_CANNOT_BE_NULL);
        return;
    }

    console.log("Signing in...");
    // Get user
    let user ;
    try{
        user = await User.findOne(
            {
                where: {
                    username: username
                }
            }
        );
    }
    catch(error){
        console.error(error);
        console.log("Error while getting user");
        res.status(500).send();
        return;
    }

    if (!user) {
        res.status(404).json(USER_NOT_FOUND);
        return;
    }

    // compare user password
    let doesPasswordMatches = false;
    try{
         doesPasswordMatches = await bcrypt.compare(password, user.password);
    }
    catch(error){
        console.log("Error while checking password");
        res.status(500).send();
        return;
    }

    if (!doesPasswordMatches) {
        res.status(401).json(WRONG_PASSWORD);
        return;
    }
    else {
        const token = await getTokens(user);

        const userToSend = {
            id: user.id,
            username,
            hospital_id:user.hospital_id,
            token
        }

        res.status(200).json(userToSend);
    }
})
module.exports = router;
