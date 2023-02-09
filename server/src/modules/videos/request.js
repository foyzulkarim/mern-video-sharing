const Joi = require("joi");

// We will only validate the title field here. We can also validate the other fields as well. I am putting the _id here just to show that we can put optional fields so that in future if we send _id, joi will not complain.
const schema = Joi.object().keys({
  _id: Joi.string().optional(),
  title: Joi.string().min(3).max(30).required(),
});

// We will use this function to validate the request body. We can put our custom validation logic here and return the result according to our need. If joi validation has any error, the `validationResult` object will contain a property `error` in it. We can check this property in controller and return the appropriate response to the client.
const validate = (data) => {
  const validationResult = schema.validate(data);
  console.log(`validationResult:`, validationResult);
  return validationResult;
};

module.exports = {
  validate,
};
