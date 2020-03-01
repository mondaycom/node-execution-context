
# node-execution-context
A simple, straightforward library that allows you to create persistent request-level execution context using the async_hooks module that will be accessible anywhere in the code scoped to the current request you're handling at any given moment.

## Table of Contents
- [Install](#install)
- [Getting Started](#getting-started)
- [Available Functions](#available-functions)

## Install
```
$ npm install @mondaydotcomorg/node-execution-context
```

or with yarn:

```
$ yarn add @mondaydotcomorg/node-execution-context
```

## Getting Started

Let's create a service that will use our library in order to create and get context.
```javascript
const contextProvider = require('@mondaydotcomorg/node-execution-context');

function createExecutionContext(contextData) {
    contextProvider.createExecutionContext(contextData);
};

function getExecutionContext() {
  const context = contextProvider.getExecutionContext();
  return context;
};

module.exports = {
  getExecutionContext,
  createExecutionContext
};
```

Now wherever we want in our code we can pass an object to createExecutionContext and it will be saved and accesible for any async resources descendant from that place forward.

For example let's do this in a middleware that is the first thing that runs on a new request. 
```javascript
const executionContextService = require('services/execution-context-service');

async function authenticationMiddleware(req, res, next) {
    const { accountPermissions } = req.body
    
    executionContextService.createExecutionContext({
      accountPermissions,
      method: req.method,
    });

    next();
}
```

Now we can use this context later and be certain that the request being handled is the same one for which we are getting our context.

```javascript
const executionContextService = require('services/execution-context-service');
const eventModelService =  require('services/event-model-service');

async function createNewEvent(eventData) {
    const { accountPermissions } = executionContextService.getExecutionContext();
    eventModelService.createEvent(accountPermissions, eventData);
}
```

## Available Functions
### createExecutionContext(contextObject, traceOptions = { enabled: false, initialData: {} })
Creates an execution context identified by the asyncId of the current asyncResource. This will be available anywhere in the execution that is inside the async chain of this resource. 
Context passed must be an object. 
You cannot create an execution context twice within the same async resource. If you want to update after creation use set ot update. This check will fail only in non-prod environments for performance purposes.

Optional Params: traceOptions can be passed if you want to set some initial trace data into the trace and have the context add a trace detailing async Id and resource type each time context is updated. If you do not pass this object the trace is never created. This can be used for debugging or for enriching logs, however should not be passed if not needed as this will be added fro every async resource created.

### getExecutionContext()
Returns only the context object given as the first param to createExecutionContext.
  
### getExecutionTrace()
Returns only the trace array collected if enabled in traceOptions.

### getExecutionData()
Returns entire context data including both context object and trace array.
   
### setExecutionContext(newContext)
Allows you to completly override context saved for current async resource. 

### updateExecutionContext(contextUpdates)
Allows you update specific keys in the context saved for current async resource. 
