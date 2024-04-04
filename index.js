const express = require("express");
const app = express();
const classify = require("./routes/classify/classify");
const cors = require("cors");
const swaggerJSDOc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./configs/swaggerConfig");
const swaggerSpec = swaggerJSDOc(swaggerOptions)

app.use(cors())
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerSpec))

const PORT = 8080;

app.use("/classify",classify)

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
    console.log(`Server running on port ${PORT}`)
})