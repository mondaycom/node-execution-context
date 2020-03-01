const asyncHooks = require("async_hooks");
const { verifyContextIsObject } = require("../utils/verify-is-type-object");
const { CONTEXT_ALREADY_DECLARED } = require("../errors");
const IS_NOT_PROD = process.env.NODE_ENV !== "production";

function createExecutionContext(
  context,
  traceOptions = { enabled: false, initialData: {} }
) {
  const asyncId = asyncHooks.executionAsyncId();
  const { enabled, initialData } = traceOptions;
  let traceArray;

  if (enabled) {
    traceArray = [
      `asyncId ${asyncId}: ${initialData}, eAID: ${asyncHooks.executionAsyncId()}`
    ];
  }

  // const executionContextCheck = executionContextMap.get(asyncId);
  if (IS_NOT_PROD) {
    if (executionContextMap.has(asyncId)) throw CONTEXT_ALREADY_DECLARED;
    verifyContextIsObject(context);
  }

  executionContextMap.set(asyncId, { context, traceArray });
}

module.exports = { createExecutionContext };
