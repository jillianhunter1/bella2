import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as core from "../src/core.js";
import { interpret, evaluate, executeStatement, createInitialMemory, Memory } from "../src/interpreter.js";

describe("Bella Interpreter", () => {
  it("interprets print statements with numeric literals and arithmetic", () => {
    const program = new core.Program(
      new core.Block([
        new core.PrintStatement(12),
        new core.PrintStatement(
          new core.BinaryExpression(
            "+",
            5,
            new core.BinaryExpression("*", 3, 2)
          )
        ),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [12, 11]);
  });

  it("handles variable declarations and assignments", () => {
    const program = new core.Program(
      new core.Block([
        new core.VariableDeclaration("x", 10),
        new core.Assignment(
          "x",
          new core.BinaryExpression("+", new core.Variable("x"), 5)
        ),
        new core.PrintStatement(new core.Variable("x")),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [15]);
  });

  it("evaluates relational, unary, and ternary operators correctly", () => {
    const program = new core.Program(
      new core.Block([
        new core.PrintStatement(new core.UnaryExpression("!", 0)),
        new core.PrintStatement(new core.UnaryExpression("!", 5)),
        new core.PrintStatement(new core.UnaryExpression("-", 5)),
        new core.PrintStatement(
          new core.TernaryExpression(
            new core.BinaryExpression(">", 3, 2),
            100,
            200
          )
        ),
        new core.PrintStatement(
          new core.TernaryExpression(
            new core.BinaryExpression("<", 3, 2),
            100,
            200
          )
        ),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [1, 0, -5, 100, 200]);
  });

  it("handles short-circuit logical operators && and ||", () => {
    const program = new core.Program(
      new core.Block([
        new core.PrintStatement(new core.BinaryExpression("&&", 0, 5)),
        new core.PrintStatement(new core.BinaryExpression("&&", 1, 5)),
        new core.PrintStatement(new core.BinaryExpression("||", 7, 10)),
        new core.PrintStatement(new core.BinaryExpression("||", 0, 10)),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [0, 5, 7, 10]);
  });

  it("evaluates all binary operators (-, /, %, **, ==, !=, <=, >=)", () => {
    const mem = createInitialMemory();
    assert.strictEqual(evaluate(new core.BinaryExpression("-", 10, 4), mem), 6);
    assert.strictEqual(evaluate(new core.BinaryExpression("/", 20, 5), mem), 4);
    assert.strictEqual(evaluate(new core.BinaryExpression("%", 17, 5), mem), 2);
    assert.strictEqual(evaluate(new core.BinaryExpression("**", 2, 3), mem), 8);
    assert.strictEqual(evaluate(new core.BinaryExpression("==", 5, 5), mem), 1);
    assert.strictEqual(evaluate(new core.BinaryExpression("==", 5, 3), mem), 0);
    assert.strictEqual(evaluate(new core.BinaryExpression("!=", 5, 3), mem), 1);
    assert.strictEqual(evaluate(new core.BinaryExpression("!=", 5, 5), mem), 0);
    assert.strictEqual(evaluate(new core.BinaryExpression("<=", 5, 5), mem), 1);
    assert.strictEqual(evaluate(new core.BinaryExpression(">=", 5, 5), mem), 1);
    assert.strictEqual(evaluate(new core.BinaryExpression("<=", 6, 5), mem), 0);
    assert.strictEqual(evaluate(new core.BinaryExpression(">=", 4, 5), mem), 0);
  });

  it("executes while loops", () => {
    const program = new core.Program(
      new core.Block([
        new core.VariableDeclaration("count", 3),
        new core.WhileStatement(
          new core.BinaryExpression(">", new core.Variable("count"), 0),
          new core.Block([
            new core.PrintStatement(new core.Variable("count")),
            new core.Assignment(
              "count",
              new core.BinaryExpression("-", new core.Variable("count"), 1)
            ),
          ])
        ),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [3, 2, 1]);
  });

  it("handles user functions including recursive functions (gcd)", () => {
    const gcdDec = new core.FunctionDeclaration(
      "gcd",
      ["x", "y"],
      new core.TernaryExpression(
        new core.BinaryExpression("==", new core.Variable("y"), 0),
        new core.Variable("x"),
        new core.FunctionCall("gcd", [
          new core.Variable("y"),
          new core.BinaryExpression("%", new core.Variable("x"), new core.Variable("y")),
        ])
      )
    );

    const program = new core.Program(
      new core.Block([
        gcdDec,
        new core.PrintStatement(new core.FunctionCall("gcd", [12, 8])),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [4]);
  });

  it("uses built-in standard library functions and π constant", () => {
    const program = new core.Program(
      new core.Block([
        new core.PrintStatement(new core.FunctionCall("sin", [0])),
        new core.PrintStatement(new core.FunctionCall("cos", [0])),
        new core.PrintStatement(new core.FunctionCall("exp", [0])),
        new core.PrintStatement(new core.FunctionCall("ln", [1])),
        new core.PrintStatement(new core.FunctionCall("sqrt", [16])),
        new core.PrintStatement(new core.FunctionCall("hypot", [3, 4])),
        new core.PrintStatement(new core.Variable("π")),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [0, 1, 1, 0, 4, 5, Math.PI]);
  });

  it("tests Memory methods and boolean literal expressions", () => {
    const parentMem = new Memory();
    parentMem.set("a", { kind: "variable", value: 1, readOnly: false });
    const childMem = new Memory(parentMem);

    assert.strictEqual(childMem.has("a"), true);
    assert.strictEqual(childMem.has("b"), false);

    assert.strictEqual(evaluate(true, childMem), 1);
    assert.strictEqual(evaluate(false, childMem), 0);
  });

  it("throws error when trying to reassign read-only variable π or function", () => {
    const memory = createInitialMemory();
    const output: number[] = [];

    assert.throws(() => {
      executeStatement(new core.Assignment("π", 3.14), memory, output);
    }, /Cannot assign to read-only variable 'π'/);

    assert.throws(() => {
      executeStatement(new core.Assignment("sqrt", 1), memory, output);
    }, /Cannot assign to function 'sqrt'/);

    assert.throws(() => {
      executeStatement(new core.Assignment("undeclaredVar", 1), memory, output);
    }, /Cannot assign to undeclared variable 'undeclaredVar'/);
  });

  it("throws error for undeclared variables, invalid operators, or wrong argument counts", () => {
    const memory = createInitialMemory();

    assert.throws(() => {
      evaluate(new core.Variable("unknownVar"), memory);
    }, /Undefined variable 'unknownVar'/);

    assert.throws(() => {
      evaluate(new core.Variable("sqrt"), memory);
    }, /'sqrt' is not a variable/);

    assert.throws(() => {
      evaluate(new core.UnaryExpression("badOp" as any, 10), memory);
    }, /Unknown unary operator 'badOp'/);

    assert.throws(() => {
      evaluate(new core.BinaryExpression("badOp" as any, 1, 2), memory);
    }, /Unknown binary operator 'badOp'/);

    assert.throws(() => {
      evaluate(new core.FunctionCall("unknownFunc", []), memory);
    }, /Undefined function 'unknownFunc'/);

    assert.throws(() => {
      evaluate(new core.FunctionCall("sqrt", [16, 25]), memory);
    }, /expected 1 argument\(s\), got 2/);

    memory.set("x", { kind: "variable", value: 10, readOnly: false });
    assert.throws(() => {
      evaluate(new core.FunctionCall("x", []), memory);
    }, /'x' is not a callable function/);

    memory.set("userFn", {
      kind: "userFunction",
      params: ["a", "b"],
      body: new core.Variable("a"),
    });

    assert.throws(() => {
      evaluate(new core.FunctionCall("userFn", [1]), memory);
    }, /expected 2 argument\(s\), got 1/);

    assert.strictEqual(
      evaluate(new core.FunctionCall("userFn", [42, 99]), memory),
      42
    );

    assert.throws(() => {
      evaluate({} as any, memory);
    }, /Invalid AST expression node/);
  });
});
