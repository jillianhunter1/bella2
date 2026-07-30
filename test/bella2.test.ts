import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as b2 from "../src/bella2.js";

describe("Bella 2 Interpreter Complete Test Suite", () => {
  it("interprets basic numerals, booleans, and print statements", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.PrintStatement(new b2.Numeral(42)),
        new b2.PrintStatement(new b2.BooleanLiteral(true)),
        new b2.PrintStatement(new b2.BooleanLiteral(false)),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [42, true, false]);
  });

  it("handles variable declarations, assignments, and identifiers", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.VariableDeclaration(new b2.Identifier("x"), new b2.Numeral(10)),
        new b2.PrintStatement(new b2.Identifier("x")),
        new b2.Assignment(new b2.Identifier("x"), new b2.Numeral(25)),
        new b2.PrintStatement(new b2.Identifier("x")),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [10, 25]);
  });

  it("evaluates unary operators '-' and '!'", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.PrintStatement(
          new b2.UnaryExpression("-", new b2.Numeral(15))
        ),
        new b2.PrintStatement(
          new b2.UnaryExpression("!", new b2.BooleanLiteral(true))
        ),
        new b2.PrintStatement(
          new b2.UnaryExpression("!", new b2.Numeral(0))
        ),
        new b2.PrintStatement(
          new b2.UnaryExpression("!", new b2.Numeral(5))
        ),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [-15, false, true, false]);
  });

  it("evaluates binary operators (+, -, *, /, %, **, relational)", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.PrintStatement(
          new b2.BinaryExpression("+", new b2.Numeral(5), new b2.Numeral(3))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("-", new b2.Numeral(10), new b2.Numeral(4))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("*", new b2.Numeral(6), new b2.Numeral(7))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("/", new b2.Numeral(20), new b2.Numeral(5))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("%", new b2.Numeral(17), new b2.Numeral(5))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("**", new b2.Numeral(2), new b2.Numeral(4))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("<", new b2.Numeral(2), new b2.Numeral(5))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("<=", new b2.Numeral(5), new b2.Numeral(5))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression(">", new b2.Numeral(10), new b2.Numeral(3))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression(">=", new b2.Numeral(10), new b2.Numeral(10))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("==", new b2.Numeral(10), new b2.Numeral(10))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("!=", new b2.Numeral(10), new b2.Numeral(5))
        ),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [
      8, 6, 42, 4, 2, 16, true, true, true, true, true, true,
    ]);
  });

  it("evaluates logical && and || short-circuiting", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.PrintStatement(
          new b2.BinaryExpression("&&", new b2.BooleanLiteral(false), new b2.Numeral(100))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("&&", new b2.Numeral(1), new b2.Numeral(50))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("||", new b2.Numeral(99), new b2.Numeral(0))
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression("||", new b2.BooleanLiteral(false), new b2.Numeral(88))
        ),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [false, 50, 99, 88]);
  });

  it("evaluates conditional expressions (ternary)", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.PrintStatement(
          new b2.ConditionalExpression(
            new b2.BooleanLiteral(true),
            new b2.Numeral(10),
            new b2.Numeral(20)
          )
        ),
        new b2.PrintStatement(
          new b2.ConditionalExpression(
            new b2.BooleanLiteral(false),
            new b2.Numeral(10),
            new b2.Numeral(20)
          )
        ),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [10, 20]);
  });

  it("handles array literals, subscript expressions, array concatenation, and equality", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.VariableDeclaration(
          new b2.Identifier("arr"),
          new b2.ArrayLiteral([new b2.Numeral(10), new b2.Numeral(20), new b2.Numeral(30)])
        ),
        new b2.PrintStatement(new b2.Identifier("arr")),
        new b2.PrintStatement(
          new b2.SubscriptExpression(new b2.Identifier("arr"), new b2.Numeral(1))
        ),
        // Array concatenation
        new b2.PrintStatement(
          new b2.BinaryExpression(
            "+",
            new b2.Identifier("arr"),
            new b2.ArrayLiteral([new b2.Numeral(40)])
          )
        ),
        // Array equality
        new b2.PrintStatement(
          new b2.BinaryExpression(
            "==",
            new b2.ArrayLiteral([new b2.Numeral(1), new b2.Numeral(2)]),
            new b2.ArrayLiteral([new b2.Numeral(1), new b2.Numeral(2)])
          )
        ),
        new b2.PrintStatement(
          new b2.BinaryExpression(
            "!=",
            new b2.ArrayLiteral([new b2.Numeral(1)]),
            new b2.ArrayLiteral([new b2.Numeral(1), new b2.Numeral(2)])
          )
        ),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [
      [10, 20, 30],
      20,
      [10, 20, 30, 40],
      true,
      true,
    ]);
  });

  it("handles built-in standard library functions and pi constant", () => {
    const prog = new b2.Program(
      new b2.Block([
        new b2.PrintStatement(
          new b2.Call(new b2.Identifier("sqrt"), [new b2.Numeral(16)])
        ),
        new b2.PrintStatement(
          new b2.Call(new b2.Identifier("hypot"), [new b2.Numeral(3), new b2.Numeral(4)])
        ),
        new b2.PrintStatement(new b2.Identifier("pi")),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [4, 5, Math.PI]);
  });

  it("handles user functions including recursion", () => {
    // function double(x) = x * 2;
    // function fact(n) = n <= 1 ? 1 : n * fact(n - 1);
    const prog = new b2.Program(
      new b2.Block([
        new b2.FunctionDeclaration(
          new b2.Identifier("double"),
          [new b2.Identifier("x")],
          new b2.BinaryExpression("*", new b2.Identifier("x"), new b2.Numeral(2))
        ),
        new b2.PrintStatement(
          new b2.Call(new b2.Identifier("double"), [new b2.Numeral(21)])
        ),
        new b2.FunctionDeclaration(
          new b2.Identifier("fact"),
          [new b2.Identifier("n")],
          new b2.ConditionalExpression(
            new b2.BinaryExpression("<=", new b2.Identifier("n"), new b2.Numeral(1)),
            new b2.Numeral(1),
            new b2.BinaryExpression(
              "*",
              new b2.Identifier("n"),
              new b2.Call(new b2.Identifier("fact"), [
                new b2.BinaryExpression("-", new b2.Identifier("n"), new b2.Numeral(1)),
              ])
            )
          )
        ),
        new b2.PrintStatement(
          new b2.Call(new b2.Identifier("fact"), [new b2.Numeral(5)])
        ),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [42, 120]);
  });

  it("handles while loops correctly", () => {
    // let i = 3; while i > 0 { print i; i = i - 1; }
    const prog = new b2.Program(
      new b2.Block([
        new b2.VariableDeclaration(new b2.Identifier("i"), new b2.Numeral(3)),
        new b2.WhileStatement(
          new b2.BinaryExpression(">", new b2.Identifier("i"), new b2.Numeral(0)),
          new b2.Block([
            new b2.PrintStatement(new b2.Identifier("i")),
            new b2.Assignment(
              new b2.Identifier("i"),
              new b2.BinaryExpression("-", new b2.Identifier("i"), new b2.Numeral(1))
            ),
          ])
        ),
      ])
    );
    assert.deepStrictEqual(b2.interpret(prog), [3, 2, 1]);
  });

  it("throws appropriate runtime errors for invalid operations", () => {
    const emptyMem = new Map();

    // Undeclared identifier
    assert.throws(() => {
      new b2.Identifier("ghost").interpret(emptyMem);
    }, /Identifier 'ghost' was undeclared/);

    // Re-declaring variable
    assert.throws(() => {
      const prog = new b2.Program(
        new b2.Block([
          new b2.VariableDeclaration(new b2.Identifier("a"), new b2.Numeral(1)),
          new b2.VariableDeclaration(new b2.Identifier("a"), new b2.Numeral(2)),
        ])
      );
      b2.interpret(prog);
    }, /Identifier 'a' already declared/);

    // Re-declaring function
    assert.throws(() => {
      const prog = new b2.Program(
        new b2.Block([
          new b2.FunctionDeclaration(new b2.Identifier("f"), [], new b2.Numeral(1)),
          new b2.FunctionDeclaration(new b2.Identifier("f"), [], new b2.Numeral(2)),
        ])
      );
      b2.interpret(prog);
    }, /Identifier 'f' already declared/);

    // Assigning undeclared or pi
    assert.throws(() => {
      const prog = new b2.Program(
        new b2.Block([
          new b2.Assignment(new b2.Identifier("ghost"), new b2.Numeral(1)),
        ])
      );
      b2.interpret(prog);
    }, /Cannot assign to undeclared variable 'ghost'/);

    assert.throws(() => {
      const prog = new b2.Program(
        new b2.Block([
          new b2.Assignment(new b2.Identifier("pi"), new b2.Numeral(3)),
        ])
      );
      b2.interpret(prog);
    }, /Cannot reassign read-only identifier 'pi'/);

    // Calling non-function or wrong parameter count
    assert.throws(() => {
      const prog = new b2.Program(
        new b2.Block([
          new b2.VariableDeclaration(new b2.Identifier("num"), new b2.Numeral(5)),
          new b2.PrintStatement(new b2.Call(new b2.Identifier("num"), [])),
        ])
      );
      b2.interpret(prog);
    }, /Not a function/);

    assert.throws(() => {
      const prog = new b2.Program(
        new b2.Block([
          new b2.FunctionDeclaration(
            new b2.Identifier("f"),
            [new b2.Identifier("a")],
            new b2.Identifier("a")
          ),
          new b2.PrintStatement(new b2.Call(new b2.Identifier("f"), [])),
        ])
      );
      b2.interpret(prog);
    }, /Wrong number of arguments/);

    // Invalid Unary / Binary operations
    assert.throws(() => {
      new b2.UnaryExpression("-", new b2.BooleanLiteral(true)).interpret(emptyMem);
    }, /Unary '-' requires a numeric operand/);

    assert.throws(() => {
      new b2.UnaryExpression("!", new b2.ArrayLiteral([])).interpret(emptyMem);
    }, /Unary '!' requires a boolean or numeric operand/);

    assert.throws(() => {
      new b2.UnaryExpression("invalid", new b2.Numeral(1)).interpret(emptyMem);
    }, /Unknown unary operator 'invalid'/);

    assert.throws(() => {
      new b2.BinaryExpression("-", new b2.BooleanLiteral(true), new b2.Numeral(1)).interpret(emptyMem);
    }, /Type error in '-' operator/);

    assert.throws(() => {
      new b2.BinaryExpression("*", new b2.ArrayLiteral([]), new b2.Numeral(1)).interpret(emptyMem);
    }, /Type error in '\*' operator/);

    assert.throws(() => {
      new b2.BinaryExpression("/", new b2.BooleanLiteral(true), new b2.Numeral(1)).interpret(emptyMem);
    }, /Type error in '\/' operator/);

    assert.throws(() => {
      new b2.BinaryExpression("%", new b2.BooleanLiteral(true), new b2.Numeral(1)).interpret(emptyMem);
    }, /Type error in '%' operator/);

    assert.throws(() => {
      new b2.BinaryExpression("**", new b2.BooleanLiteral(true), new b2.Numeral(1)).interpret(emptyMem);
    }, /Type error in '\*\*' operator/);

    assert.throws(() => {
      new b2.BinaryExpression("+", new b2.Numeral(1), new b2.BooleanLiteral(true)).interpret(emptyMem);
    }, /Type error in '\+' operator/);

    assert.throws(() => {
      new b2.BinaryExpression("invalid", new b2.Numeral(1), new b2.Numeral(2)).interpret(emptyMem);
    }, /Unknown or invalid binary operator 'invalid'/);

    // Subscript errors
    assert.throws(() => {
      new b2.SubscriptExpression(new b2.Numeral(100), new b2.Numeral(0)).interpret(emptyMem);
    }, /Target is not an array/);

    assert.throws(() => {
      new b2.SubscriptExpression(
        new b2.ArrayLiteral([new b2.Numeral(1)]),
        new b2.BooleanLiteral(true)
      ).interpret(emptyMem);
    }, /Subscript index must be an integer/);

    assert.throws(() => {
      new b2.SubscriptExpression(
        new b2.ArrayLiteral([new b2.Numeral(1)]),
        new b2.Numeral(5)
      ).interpret(emptyMem);
    }, /Array index out of bounds/);
  });
});
