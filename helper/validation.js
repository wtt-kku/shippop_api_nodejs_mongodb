const Joi = require("@hapi/joi");

const loginRegisValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(5).required().email(),
    password: Joi.string().min(1).required(),
  });
  return schema.validate(data);
};

const bookValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discout: Joi.number().required(),
  });
  return schema.validate(data);
};

module.exports.loginRegisValidation = loginRegisValidation;
module.exports.bookValidation = bookValidation;
