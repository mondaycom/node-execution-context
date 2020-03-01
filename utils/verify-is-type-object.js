const { CONTEXT_MUST_BE_AN_OBJECT } = require("../errors");

function verifyContextIsObject(context) {
  if (typeof context !== "object") throw CONTEXT_MUST_BE_AN_OBJECT;
}

module.exports = { verifyContextIsObject };
