"use strict";
const asyncHooks = require("async_hooks");
const { init, destroy } = require("./async-hooks-callbacks");
const {
  getExecutionContext,
  getExecutionTrace,
  getExecutionData
} = require("./execution-context-services/get-context-services");
const {
  setExecutionContext,
  updateExecutionContext
} = require("./execution-context-services/set-context-services");
const {
  createExecutionContext
} = require("./execution-context-services/create-context-service");

global.executionContextMap = new Map();

const asyncHook = asyncHooks.createHook({ init, destroy });
asyncHook.enable();

module.exports = {
  getExecutionContext,
  getExecutionTrace,
  getExecutionData,
  createExecutionContext,
  setExecutionContext,
  updateExecutionContext
};
