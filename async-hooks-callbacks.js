function init(asyncId, type, triggerAsyncId) {
  const parentContext = executionContextMap.get(triggerAsyncId);
  if (!parentContext) return;

  let traceArray;
  if (parentContext.traceArray) {
    traceArray = parentContext.traceArray.concat(
      `asyncId ${asyncId}: ${type}, eAID: ${asyncHooks.executionAsyncId()}, tAID: ${triggerAsyncId}`
    );
  }

  const newContext = { context: parentContext.context }; // direct use instaed of deconstruct for performance
  if (traceArray) newContext.traceArray = traceArray;

  executionContextMap.set(asyncId, newContext);
}

function destroy(asyncId) {
  executionContextMap.delete(asyncId);
}

module.exports = { init, destroy };
