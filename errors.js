const CONTEXT_ALREADY_DECLARED = new Error(
  "Execution context has already been created for this async resource"
);
const CONTEXT_MUST_BE_AN_OBJECT = new Error(
  "Execution context must be a object"
);

module.exports = {
  CONTEXT_ALREADY_DECLARED,
  CONTEXT_MUST_BE_AN_OBJECT
};
