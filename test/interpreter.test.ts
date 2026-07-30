import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as core from "../src/core.js";
import { interpret, evaluate, executeStatement, createInitialMemory } from "../src/interpreter.js";

describe("Bella Interpreter", () => {
  it("interprets print statements with numeric literals and arithmetic", () => {
    // print 12; print 5 + 3 * 2;
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
    // let x = 10; x = x + 5; print x;
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
    // print !0; print -5; print (3 > 2 ? 100 : 200);
    const program = new core.Program(
      new core.Block([
        new core.PrintStatement(new core.UnaryExpression("!", 0)),
        new core.PrintStatement(new core.UnaryExpression("-", 5)),
        new core.PrintStatement(
          new core.TernaryExpression(
            new core.BinaryExpression(">", 3, 2),
            100,
            200
          )
        ),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [1, -5, 100]);
  });

  it("handles short-circuit logical operators && and ||", () => {
    // print (0 && 5); print (7 || 10);
    const program = new core.Program(
      new core.Block([
        new core.PrintStatement(new core.BinaryExpression("&&", 0, 5)),
        new core.PrintStatement(new core.BinaryExpression("||", 7, 10)),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [0, 7]);
  });

  it("executes while loops", () => {
    // let count = 3; while count > 0 { print count; count = count - 1; }
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
    // function gcd(x, y) = y == 0 ? x : gcd(y, x % y);
    // print gcd(12, 8);
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
    // print sqrt(16); print hypot(3, 4); print π;
    const program = new core.Program(
      new core.Block([
        new core.PrintStatement(new core.FunctionCall("sqrt", [16])),
        new core.PrintStatement(new core.FunctionCall("hypot", [3, 4])),
        new core.PrintStatement(new core.Variable("π")),
      ])
    );

    const output = interpret(program);
    assert.deepStrictEqual(output, [4, 5, Math.PI]);
  });

  it("throws error when trying to reassign read-only variable π or function", () => {
    const memory = createInitialMemory();
    const output: number[] = [];

    assert.throws(() => {
      executeStatement(new core.Assignment("π", 3.14), memory, output);
    }, /Cannot assign to read-only variable 'π'/);
  });

  it("throws error for undeclared variables or wrong argument counts", () => {
    const memory = createInitialMemory();

    assert.throws(() => {
      evaluate(new core.Variable("unknownVar"), memory);
    }, /Undefined variable 'unknownVar'/);

    assert.throws(() => {
      evaluate(new core.FunctionCall("sqrt", [16, 25]), memory);
    }, /expected 1 argument\(s\), got 2/);
  });
});
