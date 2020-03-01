const executionContextService = require("../index");

describe("index", () => {
  describe("createExecutionContext and getExecutionContext", () => {
    it("should pass context", async () => {
      const asyncOuter = async function() {
        executionContextService.createExecutionContext({
          mantra: "this is the way"
        });
        await asyncInner();
      };

      const asyncInner = async function() {
        expect(executionContextService.getExecutionContext().mantra).toBe(
          "this is the way"
        );
      };

      await asyncOuter();
    });

    it("should pass context", async () => {
      let runs = 0;
      const asyncOuter = async function() {
        executionContextService.createExecutionContext({
          mantra: "this is the way"
        });
        await asyncInner();
      };

      const nestedInner = async function() {
        expect(executionContextService.getExecutionContext().mantra).toBe(
          "this is the way"
        );
        runs += 1;
      };

      const asyncInner = async function() {
        expect(executionContextService.getExecutionContext().mantra).toBe(
          "this is the way"
        );
        runs += 1;

        await nestedInner();
      };

      await asyncOuter();
      expect(runs).toBe(2);
    });

    it("should return full execution context", async () => {
      const asyncOuter = async function() {
        executionContextService.createExecutionContext({
          mantra: "this is the way"
        });
        await asyncInner();
      };

      const asyncInner = async function() {
        expect(executionContextService.getExecutionData().context.mantra).toBe(
          "this is the way"
        );
      };

      await asyncOuter();
    });

    it("should have different ids between contexts created in different resources", async () => {
      const expected1 = "This is the way";
      const expected2 = "I have spoken";

      const asyncOuter = async function(expected) {
        executionContextService.createExecutionContext({
          mantra: expected
        });
        await asyncInner(expected);
      };

      const asyncInner = async function(expected) {
        expect(executionContextService.getExecutionContext().mantra).toBe(
          expected
        );
      };

      await asyncOuter(expected1);
      await asyncOuter(expected2);
    });

    it("should throw when trying to create execution context twice in the same resource", async () => {
      const expected1 = "May the force be with you";
      const expected2 = "Hello There";

      const asyncFunc = async function(expected) {
        executionContextService.createExecutionContext({
          mantra: expected
        });

        executionContextService.createExecutionContext({
          mantra: expected2
        });
      };

      let errorThrown = false;
      try {
        await asyncFunc(expected1);
      } catch (err) {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });

    it("should throw when context given is not an object", async () => {
      const theMeaningOfLife = 42;

      const asyncFunc = async function(context) {
        executionContextService.createExecutionContext(context);
      };

      let errorThrown = false;
      try {
        await asyncFunc(theMeaningOfLife);
      } catch (err) {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe("setExecutionContext", () => {
    it("should replace context when set is called", async () => {
      const theMeaningOfLife = 42;

      const asyncFunc = async function() {
        executionContextService.createExecutionContext({ previousValue: 1 });
        executionContextService.setExecutionContext({ theMeaningOfLife });
        await asyncInner();
      };

      const asyncInner = async function() {
        expect(
          executionContextService.getExecutionContext().theMeaningOfLife
        ).toBe(42);
      };

      await asyncFunc();
    });

    it("should throw when context given is not an object", async () => {
      const theMeaningOfLife = 42;

      const asyncFunc = async function() {
        executionContextService.createExecutionContext({ previousValue: 1 });
        executionContextService.setExecutionContext(theMeaningOfLife);
      };

      let errorThrown = false;
      try {
        await asyncFunc();
      } catch (err) {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe("updateExecutionContext", () => {
    it("should update context with updates", async () => {
      const shotFirst = "Greedo";
      const updatedShotFirst = "Han";
      const accountId = 1138;

      const asyncFunc = async function() {
        executionContextService.createExecutionContext({ shotFirst });
        await asyncInner();
      };

      const asyncInner = async function() {
        executionContextService.updateExecutionContext({
          shotFirst: updatedShotFirst,
          accountId
        });

        await asyncInnerMost();
      };

      const asyncInnerMost = async function() {
        const executionContext = executionContextService.getExecutionContext();
        expect(executionContext.accountId).toBe(1138);
        expect(executionContext.shotFirst).toBe(updatedShotFirst);
      };

      await asyncFunc();
    });
  });

  function updateExecutionContext(contextUpdates) {
    const asyncId = asyncHooks.executionAsyncId();

    const { context } = executionContextMap.get(asyncId);

    context = { ...context, contextUpdates };
  }
});
