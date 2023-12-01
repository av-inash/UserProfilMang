const Joi = require("joi");

const user ={
    body: Joi.object().keys({
        name: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .messages({ "string.pattern.base": `Name should be in only characters.` })
        .required(),
        email: Joi.string()
        .regex(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,}(?:\.com)?$/)
        .messages({ "string.pattern.base": `email don't match` })
        .required(),
        Address: Joi.string()
        .regex(/^[a-zA-Z ]+$/)
        .messages({ "string.pattern.base": `Name should be in only characters.` })
        .required(),
        password:Joi.string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/ )
        .messages({ "string.pattern.base": `password should conatin atleast 8 letters 1 uppercase, 1 lowercase and 1 special character` })
        .required(),
        latitude: Joi.number()
        .required(),
        longitude: Joi.number()
        .required(),
    })
}
module.exports = {
    user
}