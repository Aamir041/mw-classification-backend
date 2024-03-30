const express = require("express");

const app = express();
const classify = require("./routes/classify/classify")   


const PORT = 8080;

app.use("/classify",classify)


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})