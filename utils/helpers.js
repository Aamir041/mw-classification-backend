const {SECRET_KEY} = require("../constants/constants")
exports = {}

const jwt = require("jsonwebtoken");

exports.getTokens = async(user) => {
    const userDetailsAsIdentifier = {
        id: user.id,
        username : user.username,
        hospital_id: user.hospital_id
    }
    const token = jwt.sign(
        { identifier: userDetailsAsIdentifier},
        SECRET_KEY
    );

    return token;
}

exports.getHospitalIdFromToken = async (bearerToken) => {
    const token = bearerToken.substring(7); // get token from bearerToken "Bearer abcd..."
    const decoded = jwt.verify(token, SECRET_KEY); // decode token where we get {identifier and iat}
    const hospital_id = decoded.identifier.hospital_id; // get identifier.hospital_id
    return hospital_id;
}

module.exports = exports;