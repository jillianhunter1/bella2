import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as core from "../src/core.js";

describe("Core AST Nodes", () => {
  it("constructs a Program and Block node", () => {
    const printStmt: core.Statement = new core.PrintStatement(12);
    const block = new core.Block([printStmt]);
    const program = new core.Program(block);

    assert.strictEqual(program.body, block);
    assert.strictEqual(block.statements.length, 1);
    assert.strictEqual(block.statements[0], printStmt);
  });

  it("constructs VariableDeclaration, FunctionDeclaration, and Assignment", () => {
    const varDec: core.Statement = new core.VariableDeclaration("x", 5);
    const funcDec: core.Statement = new core.FunctionDeclaration(
      "add1",
      ["n"],
      new core.BinaryExpression("+", new core.Variable("n"), 1)
    );
    const assign: core.Statement = new core.Assignment("x", 10);

    assert.strictEqual((varDec as core.VariableDeclaration).name, "x");
    assert.strictEqual((varDec as core.VariableDeclaration).initializer, 5);
    assert.strictEqual((funcDec as core.FunctionDeclaration).name, "add1");
    assert.deepStrictEqual((funcDec as core.FunctionDeclaration).params, ["n"]);
    assert.strictEqual((assign as core.Assignment).target, "x");
    assert.strictEqual((assign as core.Assignment).source, 10);
  });

  it("constructs WhileStatement, Expressions, and FunctionCall", () => {
    const cond: core.Expression = new core.BinaryExpression("<", new core.Variable("x"), 10);
    const body = new core.Block([
      new core.Assignment(
        "x",
        new core.BinaryExpression("+", new core.Variable("x"), 1)
      ),
    ]);
    const whileStmt: core.Statement = new core.WhileStatement(cond, body);

    const unary: core.Expression = new core.UnaryExpression("-", 5);
    const ternary: core.Expression = new core.TernaryExpression(true, 1, 0);
    const call: core.Expression = new core.FunctionCall("sqrt", [16]);

    assert.strictEqual((whileStmt as core.WhileStatement).condition, cond);
    assert.strictEqual((whileStmt as core.WhileStatement).body, body);
    assert.strictEqual((unary as core.UnaryExpression).op, "-");
    assert.strictEqual((ternary as core.TernaryExpression).test, true);
    assert.strictEqual((call as core.FunctionCall).callee, "sqrt");
    assert.deepStrictEqual((call as core.FunctionCall).args, [16]);
  });
});
