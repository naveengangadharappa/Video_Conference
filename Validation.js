const Validator = require('validatorjs');
const { login } = require('./db/dboperations');
const errmsg = require('./ErrorMessage');
const { Level } = require("./ErrorMessage");

const User_Login = {
    User_Mobile_No: 'required|max:10',
    //password: 'required|string|min:8',
};
const User_Registeration = {
    User_Name: 'required|string',
    User_Mobile_No: 'required|max:10',
};


const validatedata = async (body, option) => {
    try {
        let validation;
        switch (option) {
            case 'login':
                validation = new Validator(body, User_Login, errmsg.User_Login);
                return validation.fails() ? { status: false, message: 'Login Validation Unsuccessfull', validation: validation.errors.errors } : { status: true }
                break;
            case 'register':
                validation = new Validator(body, User_Registeration, errmsg.User_Registeration);
                return validation.fails() ? { status: false, message: 'Registeration Validation Unsuccessfull', validation: validation.errors.errors } : { status: true }
                break;
            default: return { status: false, message: "option cannot be identified" }
        }
    } catch (err) {
        console.log(err);
        reject(err);
    }
}


module.exports = { validatedata }












