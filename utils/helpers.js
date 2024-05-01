exports = {}

const jwt = require("jsonwebtoken");

exports.getTokens = async(user) => {
    const tokenUserDetails = {
        id: user.id,
        username : user.username,
        hospital_id: user.hospital_id
    }
    const token = jwt.sign(
        { identifier: tokenUserDetails },
        "mwapp"
    );

    return token;
}

module.exports = exports;