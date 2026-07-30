import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as core from "../src/core.js";

describe("Core AST Nodes", () => {
  it("constructs a Program and Block node", () => {
    const printStmt = new core.PrintStatement(12);
    const block = new core.Block([printStmt]);
    const program = new core.Program(block);

    assert.strictEqual(program.body, block);
    assert.strictEqual(block.statements.length, 1);
    assert.strictEqual(block.statements[0], printStmt);
  });

  it("constructs VariableDeclaration, FunctionDeclaration, and Assignment", () => {
    const varDec = new core.VariableDeclaration("x", 5);
    const funcDec = new core.FunctionDeclaration(
      "add1",
      ["n"],
      new core.BinaryExpression("+", new core.Variable("n"), 1)
    );
    const assign = new core.Assignment("x", 10);

    assert.strictEqual(varDec.name, "x");
    assert.strictEqual(varDec.initializer, 5);
    assert.strictEqual(funcDec.name, "add1");
    assert.deepStrictEqual(funcDec.params, ["n"]);
    assert.strictEqual(assign.target, "x");
    assert.strictEqual(assign.source, 10);
  });

  it("constructs WhileStatement, Expressions, and FunctionCall", () => {
    const cond = new core.BinaryExpression("<", new core.Variable("x"), 10);
    const body = new core.Block([
      new core.Assignment(
        "x",
        new core.BinaryExpression("+", new core.Variable("x"), 1)
      ),
    ]);
    const whileStmt = new core.WhileStatement(cond, body);

    const unary = new core.UnaryExpression("-", 5);
    const ternary = new core.TernaryExpression(true, 1, 0);
    const call = new core.FunctionCall("sqrt", [16]);

    assert.strictEqual(whileStmt.condition, cond);
    assert.strictEqual(whileStmt.body, body);
    assert.strictEqual(unary.op, "-");
    assert.strictEqual(ternary.test, true);
    assert.strictEqual(call.callee, "sqrt");
    assert.deepStrictEqual(call.args, [16]);
  });
});
