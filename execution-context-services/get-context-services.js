const asyncHooks = require("async_hooks");

function getExecutionTrace() {
  return getExecutionData().traceArray;
}

function getExecutionContext() {
  return getExecutionData().context;
}

function getExecutionData() {
  const eAID = asyncHooks.executionAsyncId();

  const executionContext = executionContextMap.get(eAID);

  return executionContext;
}

module.exports = {
  getExecutionContext,
  getExecutionData,
  getExecutionTrace
};
