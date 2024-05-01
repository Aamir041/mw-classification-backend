const options = {
    definition: {
        openapi: '3.0.0',
        info : {
            title: "Medical Waste Classifcation Backend",
            version: "1.0.0"
        },
        servers:[
            {
                url: "http://localhost:8080",
            }
        ]
    },
    apis: ["./index.js","./routes/*.js"]
}

module.exports = options;