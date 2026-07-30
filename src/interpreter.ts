import * as core from "./core.js";

export type VariableEntity = {
  kind: "variable";
  value: number;
  readOnly: boolean;
};

export type UserFunctionEntity = {
  kind: "userFunction";
  params: string[];
  body: core.Expression;
};

export type BuiltinFunctionEntity = {
  kind: "builtinFunction";
  fn: (...args: number[]) => number;
  paramCount: number;
};

export type Entity = VariableEntity | UserFunctionEntity | BuiltinFunctionEntity;

export class Memory {
  private bindings = new Map<string, Entity>();

  constructor(parent?: Memory) {
    if (parent) {
      parent.bindings.forEach((val, key) => this.bindings.set(key, val));
    }
  }

  get(name: string): Entity | undefined {
    return this.bindings.get(name);
  }

  set(name: string, entity: Entity): void {
    this.bindings.set(name, entity);
  }

  has(name: string): boolean {
    return this.bindings.has(name);
  }
}

export function createInitialMemory(): Memory {
  const memory = new Memory();

  memory.set("π", { kind: "variable", value: Math.PI, readOnly: true });

  memory.set("sqrt", {
    kind: "builtinFunction",
    fn: Math.sqrt,
    paramCount: 1,
  });

  memory.set("sin", {
    kind: "builtinFunction",
    fn: Math.sin,
    paramCount: 1,
  });

  memory.set("cos", {
    kind: "builtinFunction",
    fn: Math.cos,
    paramCount: 1,
  });

  memory.set("exp", {
    kind: "builtinFunction",
    fn: Math.exp,
    paramCount: 1,
  });

  memory.set("ln", {
    kind: "builtinFunction",
    fn: Math.log,
    paramCount: 1,
  });

  memory.set("hypot", {
    kind: "builtinFunction",
    fn: Math.hypot,
    paramCount: 2,
  });

  return memory;
}

export function evaluate(exp: core.Expression, memory: Memory): number {
  if (typeof exp === "number") {
    return exp;
  }

  if (typeof exp === "boolean") {
    return exp ? 1 : 0;
  }

  if (exp instanceof core.Variable) {
    const entity = memory.get(exp.name);
    if (!entity) {
      throw new Error(`Undefined variable '${exp.name}'`);
    }
    if (entity.kind !== "variable") {
      throw new Error(`'${exp.name}' is not a variable`);
    }
    return entity.value;
  }

  if (exp instanceof core.UnaryExpression) {
    const operandVal = evaluate(exp.operand, memory);
    switch (exp.op) {
      case "-":
        return -operandVal;
      case "!":
        return operandVal === 0 ? 1 : 0;
      default:
        throw new Error(`Unknown unary operator '${exp.op}'`);
    }
  }

  if (exp instanceof core.BinaryExpression) {
    if (exp.op === "&&") {
      const leftVal = evaluate(exp.left, memory);
      if (leftVal === 0) return 0;
      return evaluate(exp.right, memory);
    }

    if (exp.op === "||") {
      const leftVal = evaluate(exp.left, memory);
      if (leftVal !== 0) return leftVal;
      return evaluate(exp.right, memory);
    }

    const leftVal = evaluate(exp.left, memory);
    const rightVal = evaluate(exp.right, memory);

    switch (exp.op) {
      case "+":
        return leftVal + rightVal;
      case "-":
        return leftVal - rightVal;
      case "*":
        return leftVal * rightVal;
      case "/":
        return leftVal / rightVal;
      case "%":
        return leftVal % rightVal;
      case "**":
        return leftVal ** rightVal;
      case "==":
        return leftVal === rightVal ? 1 : 0;
      case "!=":
        return leftVal !== rightVal ? 1 : 0;
      case "<":
        return leftVal < rightVal ? 1 : 0;
      case "<=":
        return leftVal <= rightVal ? 1 : 0;
      case ">":
        return leftVal > rightVal ? 1 : 0;
      case ">=":
        return leftVal >= rightVal ? 1 : 0;
      default:
        throw new Error(`Unknown binary operator '${exp.op}'`);
    }
  }

  if (exp instanceof core.TernaryExpression) {
    const testVal = evaluate(exp.test, memory);
    if (testVal !== 0) {
      return evaluate(exp.consequent, memory);
    }
    return evaluate(exp.alternate, memory);
  }

  if (exp instanceof core.FunctionCall) {
    const entity = memory.get(exp.callee);
    if (!entity) {
      throw new Error(`Undefined function '${exp.callee}'`);
    }

    const argVals = exp.args.map((arg) => evaluate(arg, memory));

    if (entity.kind === "builtinFunction") {
      if (argVals.length !== entity.paramCount) {
        throw new Error(
          `Function '${exp.callee}' expected ${entity.paramCount} argument(s), got ${argVals.length}`
        );
      }
      return entity.fn(...argVals);
    }

    if (entity.kind === "userFunction") {
      if (argVals.length !== entity.params.length) {
        throw new Error(
          `Function '${exp.callee}' expected ${entity.params.length} argument(s), got ${argVals.length}`
        );
      }

      const localMemory = new Memory(memory);
      for (let i = 0; i < entity.params.length; i++) {
        const paramName = entity.params[i];
        const argVal = argVals[i];
        if (paramName !== undefined && argVal !== undefined) {
          localMemory.set(paramName, {
            kind: "variable",
            value: argVal,
            readOnly: true,
          });
        }
      }

      return evaluate(entity.body, localMemory);
    }

    throw new Error(`'${exp.callee}' is not a callable function`);
  }

  throw new Error("Invalid AST expression node");
}

export function executeStatement(
  statement: core.Statement,
  memory: Memory,
  output: number[]
): void {
  if (statement instanceof core.VariableDeclaration) {
    const initVal = evaluate(statement.initializer, memory);
    memory.set(statement.name, {
      kind: "variable",
      value: initVal,
      readOnly: false,
    });
    return;
  }

  if (statement instanceof core.FunctionDeclaration) {
    memory.set(statement.name, {
      kind: "userFunction",
      params: statement.params,
      body: statement.body,
    });
    return;
  }

  if (statement instanceof core.Assignment) {
    const entity = memory.get(statement.target);
    if (!entity) {
      throw new Error(`Cannot assign to undeclared variable '${statement.target}'`);
    }
    if (entity.kind !== "variable") {
      throw new Error(`Cannot assign to function '${statement.target}'`);
    }
    if (entity.readOnly) {
      throw new Error(`Cannot assign to read-only variable '${statement.target}'`);
    }
    entity.value = evaluate(statement.source, memory);
    return;
  }

  if (statement instanceof core.PrintStatement) {
    const val = evaluate(statement.argument, memory);
    output.push(val);
    return;
  }

  if (statement instanceof core.WhileStatement) {
    while (evaluate(statement.condition, memory) !== 0) {
      executeBlock(statement.body, memory, output);
    }
    return;
  }

  throw new Error("Invalid AST statement node");
}

export function executeBlock(
  block: core.Block,
  memory: Memory,
  output: number[]
): void {
  for (const statement of block.statements) {
    executeStatement(statement, memory, output);
  }
}

export function interpret(program: core.Program): number[] {
  const memory = createInitialMemory();
  const output: number[] = [];
  executeBlock(program.body, memory, output);
  return output;
}
