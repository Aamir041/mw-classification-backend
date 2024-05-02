const IMAGE_FILE = "./images";
const PYTHON_FILE = "./python-script/imageClassify.py"
const MODEL = "./python-script/best.pt"
const USER_ALREADY_EXISTS = {
    message : "User already exists",
    status: 400
}
const SALT = 10;
const HOSPITAL_DOES_NOT_EXISTS = {
    message: "Hospital does not exists",
    status: 404
}
const USER_NOT_FOUND = {
    message: "User not found",
    status : 404
}
const WRONG_PASSWORD = {
    message: "Wrong password",
    status: 401
}
const USERNAME_CANNOT_BE_NULL = {
    message: "Username cannot be null",
    status: 400
}
const PASSWORD_CANNOT_BE_NULL = {
    message: "Password cannot be null",
    status: 400
}

const SECRET_KEY = "mwappsecretkey";

module.exports = {
    IMAGE_FILE,
    PYTHON_FILE,
    MODEL,
    USER_ALREADY_EXISTS,
    SALT,
    HOSPITAL_DOES_NOT_EXISTS,
    USER_NOT_FOUND,
    WRONG_PASSWORD,
    SECRET_KEY,
    USERNAME_CANNOT_BE_NULL,
    PASSWORD_CANNOT_BE_NULL
}