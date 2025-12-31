const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const schema = require("../src/content/schema/crisisManifest.schema.json");

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const validateCrisis = (data) => {
  const valid = validate(data);
  return {
    valid: Boolean(valid),
    errors: validate.errors ?? [],
  };
};

module.exports = {
  validateCrisis,
};
