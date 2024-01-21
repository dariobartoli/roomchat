const Joi = require('joi');

const dataValidation = (req, res, next) => {
    const schema = Joi.object({
        message: Joi.string()
            .min(1)
            .max(256)
            .required(),
        roomId: Joi.string()
            .required()
    })
    const validationResult = schema.validate(req.body)
    if (validationResult.error) {
        res.status(404).json({message: validationResult.error.details[0].message})
        console.error(validationResult.error.details);
    }else{
    //console.log('Data is valid');
    next()
    }
}

module.exports = {dataValidation}