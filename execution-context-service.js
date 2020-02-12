"use strict";
const asyncHooks = require("async_hooks");
const _ = require("lodash");

const executionContextMap = new Map();
const tag = "execution_context";

const asyncHook = asyncHooks.createHook({ init, destroy });
asyncHook.enable();

function init(asyncId, type, triggerAsyncId, resource) {
  try {
    if (executionContextMap.has(asyncId)) {
      logger.error(
        { tag, asyncId, triggerAsyncId },
        "Tried to assign asyncId that already exists"
      );
    }
    // Stores same request object for child async resources
    if (executionContextMap.has(triggerAsyncId)) {
      const parentContext = executionContextMap.get(triggerAsyncId);

      const parentTraceArray = _.get(parentContext, "traceArray", []);
      const parentAccountId = _.get(parentContext, "accountId", []);

      const traceArray = [
        ...parentTraceArray,
        `asyncId ${asyncId}: ${parentAccountId}`
      ];

      executionContextMap.set(asyncId, {
        ...parentContext,
        asyncId,
        triggerAsyncId,
        type,
        traceArray
      });
    }
  } catch (err) {
    logger.error(
      { err, asyncId, tag },
      "Could not perform init function for async resource"
    );
  }
}

function destroy(asyncId) {
  try {
    executionContextMap.delete(asyncId);
  } catch (err) {
    logger.error(
      { err, asyncId, tag },
      "Could not perform destroy function for async resource"
    );
  }
}

const createExecutionContext = function(contextData) {
  try {
    const asyncId = asyncHooks.executionAsyncId();
    const traceArray = [asyncId];

    executionContextMap.set(asyncId, { ...contextData, asyncId, traceArray });
  } catch (err) {
    logger.error(
      { err, contextData, tag },
      "Could not create execution context"
    );
  }
};

const getExecutionContext = function() {
  const asyncId = asyncHooks.executionAsyncId();
  const executionContext = executionContextMap.get(asyncId);
  return { executionContext };
};

module.exports = {
  getExecutionContext,
  createExecutionContext
};
