"use strict";
const asyncHooks = require("async_hooks");

const executionContextMap = new Map();

const asyncHook = asyncHooks.createHook({ init, destroy });
asyncHook.enable();

const IS_NOT_PROD = process.env.NODE_ENV !== "production";

const CONTEXT_ALREADY_DECLARED = new Error(
  "Execution context has already been created for this async resource"
);
const CONTEXT_MUST_BE_AN_OBJECT = new Error(
  "Execution context must be a object"
);

function init(asyncId, type, triggerAsyncId) {
  // if (!executionContextMap.has(triggerAsyncId)) return;

  const parentContext = executionContextMap.get(triggerAsyncId);
  if (!parentContext) return;

  let traceArray;
  if (parentContext.parentTraceArray) {
    traceArray = parentContext.parentTraceArray.concat(
      `asyncId ${asyncId}: ${type}`
    );
  }

  const newContext = { context: parentContext.context }; // direct use instaed of deconstruct for performance
  if (traceArray) newContext.traceArray = traceArray;

  executionContextMap.set(asyncId, newContext);
}

function destroy(asyncId) {
  executionContextMap.delete(asyncId);
}

function createExecutionContext(
  context,
  traceOptions = { enabled: false, initialData: {} }
) {
  const asyncId = asyncHooks.executionAsyncId();
  const { enabled, initialData } = traceOptions;
  let traceArray;

  if (enabled || initialData) {
    traceArray = [`asyncId ${asyncId}: ${initialData}`];
  }

  // const executionContextCheck = executionContextMap.get(asyncId);
  if (IS_NOT_PROD) {
    if (executionContextMap.has(asyncId)) throw CONTEXT_ALREADY_DECLARED;
    // if (typeof context !== "Object") throw CONTEXT_MUST_BE_AN_OBJECT;
  }

  executionContextMap.set(asyncId, { context, traceArray });
}

function updateExecutionContext(contextUpdates) {
  const asyncId = asyncHooks.executionAsyncId();

  const { context } = executionContextMap.get(asyncId);

  context = { ...context, contextUpdates };
}

function setExecutionContext(newContext) {
  const asyncId = asyncHooks.executionAsyncId();

  if (IS_NOT_PROD) {
    if (typeof context !== "Object") throw CONTEXT_MUST_BE_AN_OBJECT;
  }
  const { context } = executionContextMap.get(asyncId);
  context = newContext;
}

function getExecutionTrace() {
  return getExecutionData().traceArray;
}

function getExecutionContext() {
  return getExecutionData().context;
}

function getExecutionData() {
  const asyncId = asyncHooks.executionAsyncId();
  const executionContext = executionContextMap.get(asyncId);

  return executionContext;
}

// function verifyContextIsObject(context) {
//   if (typeof context !== "Object") throw CONTEXT_MUST_BE_AN_OBJECT;
// }

module.exports = {
  getExecutionContext,
  getExecutionTrace,
  getExecutionData,
  createExecutionContext,
  updateExecutionContext
};
