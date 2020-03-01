const asyncHooks = require("async_hooks");
const { verifyContextIsObject } = require("../utils/verify-is-type-object");
const IS_NOT_PROD = process.env.NODE_ENV !== "production";

function updateExecutionContext(contextUpdates) {
  const asyncId = asyncHooks.executionAsyncId();

  const contextData = executionContextMap.get(asyncId);
  const newContext = { ...contextData.context, ...contextUpdates };

  contextData.context = newContext;
}

function setExecutionContext(newContext) {
  const asyncId = asyncHooks.executionAsyncId();

  if (IS_NOT_PROD) verifyContextIsObject(newContext);

  const contextData = executionContextMap.get(asyncId);
  contextData.context = newContext;
}

module.exports = { setExecutionContext, updateExecutionContext };
