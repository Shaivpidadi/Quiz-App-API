const Joi = require('joi');

module.exports = {

    Register: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
    },

    Login: {
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
    },

    AddQuestion: {
            question: Joi.string().required(),
            correct_answer: Joi.string().required(),
            question_options: Joi.array().required()
    },


}