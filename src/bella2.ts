type BuiltInFunction = (...args: Value[]) => Value;
type UserFunction = [Identifier[], Expression];
export type Value = number | boolean | Value[] | BuiltInFunction | UserFunction;

type Memory = Map<string, Value>;
type Output = Value[];
type State = [Memory, Output];

// Custom type guards
function isUserFunction(v: Value): v is UserFunction {
  return Array.isArray(v) && v.length === 2 && Array.isArray(v[0]);
}

function isBuiltInFunction(v: Value): v is BuiltInFunction {
  return typeof v === "function";
}

function isArray(x: Value): x is Value[] {
  return Array.isArray(x) && (x.length === 0 || !Array.isArray(x[0]));
}

// Expressions
export interface Expression {
  interpret(m: Memory): Value;
}

export class Numeral implements Expression {
  constructor(public value: number) {}
  interpret(_: Memory): Value {
    return this.value;
  }
}

export class BooleanLiteral implements Expression {
  constructor(public value: boolean) {}
  interpret(_: Memory): Value {
    return this.value;
  }
}

export class Identifier implements Expression {
  constructor(public name: string) {}
  interpret(m: Memory): Value {
    const value = m.get(this.name);
    if (value === undefined) {
      throw new Error(`Identifier '${this.name}' was undeclared`);
    }
    return value;
  }
}

export class UnaryExpression implements Expression {
  constructor(
    public operator: string,
    public expression: Expression
  ) {}
  interpret(m: Memory): Value {
    const val = this.expression.interpret(m);
    if (this.operator === "-") {
      if (typeof val !== "number") {
        throw new Error("Unary '-' requires a numeric operand");
      }
      return -val;
    }
    if (this.operator === "!") {
      if (typeof val === "boolean") {
        return !val;
      }
      if (typeof val === "number") {
        return val === 0;
      }
      throw new Error("Unary '!' requires a boolean or numeric operand");
    }
    throw new Error(`Unknown unary operator '${this.operator}'`);
  }
}

export class BinaryExpression implements Expression {
  constructor(
    public operator: string,
    public left: Expression,
    public right: Expression
  ) {}
  interpret(m: Memory): Value {
    if (this.operator === "&&") {
      const leftVal = this.left.interpret(m);
      if (leftVal === false || leftVal === 0) {
        return leftVal;
      }
      return this.right.interpret(m);
    }

    if (this.operator === "||") {
      const leftVal = this.left.interpret(m);
      if (leftVal !== false && leftVal !== 0) {
        return leftVal;
      }
      return this.right.interpret(m);
    }

    const leftVal = this.left.interpret(m);
    const rightVal = this.right.interpret(m);

    if (this.operator === "+") {
      if (typeof leftVal === "number" && typeof rightVal === "number") {
        return leftVal + rightVal;
      }
      if (isArray(leftVal) && isArray(rightVal)) {
        return [...leftVal, ...rightVal];
      }
      throw new Error("Type error in '+' operator");
    }

    if (this.operator === "-") {
      if (typeof leftVal === "number" && typeof rightVal === "number") {
        return leftVal - rightVal;
      }
      throw new Error("Type error in '-' operator");
    }

    if (this.operator === "*") {
      if (typeof leftVal === "number" && typeof rightVal === "number") {
        return leftVal * rightVal;
      }
      throw new Error("Type error in '*' operator");
    }

    if (this.operator === "/") {
      if (typeof leftVal === "number" && typeof rightVal === "number") {
        return leftVal / rightVal;
      }
      throw new Error("Type error in '/' operator");
    }

    if (this.operator === "%") {
      if (typeof leftVal === "number" && typeof rightVal === "number") {
        return leftVal % rightVal;
      }
      throw new Error("Type error in '%' operator");
    }

    if (this.operator === "**") {
      if (typeof leftVal === "number" && typeof rightVal === "number") {
        return leftVal ** rightVal;
      }
      throw new Error("Type error in '**' operator");
    }

    if (this.operator === "==") {
      if (isArray(leftVal) && isArray(rightVal)) {
        if (leftVal.length !== rightVal.length) return false;
        return leftVal.every((v, i) => v === rightVal[i]);
      }
      return leftVal === rightVal;
    }

    if (this.operator === "!=") {
      if (isArray(leftVal) && isArray(rightVal)) {
        if (leftVal.length !== rightVal.length) return true;
        return !leftVal.every((v, i) => v === rightVal[i]);
      }
      return leftVal !== rightVal;
    }

    if (
      typeof leftVal === "number" &&
      typeof rightVal === "number"
    ) {
      if (this.operator === "<") return leftVal < rightVal;
      if (this.operator === "<=") return leftVal <= rightVal;
      if (this.operator === ">") return leftVal > rightVal;
      if (this.operator === ">=") return leftVal >= rightVal;
    }

    throw new Error(`Unknown or invalid binary operator '${this.operator}'`);
  }
}

export class Call implements Expression {
  constructor(
    public callee: Identifier,
    public args: Expression[]
  ) {}
  interpret(m: Memory): Value {
    const functionValue = m.get(this.callee.name);
    const argValues = this.args.map((arg) => arg.interpret(m));
    if (functionValue === undefined) {
      throw new Error("Identifier was undeclared");
    } else if (isUserFunction(functionValue)) {
      const [parameters, expression] = functionValue;
      if (parameters.length !== this.args.length) {
        throw new Error("Wrong number of arguments");
      }
      const locals = parameters.map(
        (p, i) => [p.name, argValues[i]!] as const
      );
      return expression.interpret(new Map([...m, ...locals]));
    } else if (isBuiltInFunction(functionValue)) {
      return functionValue(...argValues);
    } else {
      throw new Error("Not a function");
    }
  }
}

export class ConditionalExpression implements Expression {
  constructor(
    public test: Expression,
    public consequent: Expression,
    public alternate: Expression
  ) {}
  interpret(m: Memory): Value {
    const testVal = this.test.interpret(m);
    const isTruthy =
      testVal !== false && testVal !== 0;
    if (isTruthy) {
      return this.consequent.interpret(m);
    }
    return this.alternate.interpret(m);
  }
}

export class ArrayLiteral implements Expression {
  constructor(public elements: Expression[]) {}
  interpret(m: Memory): Value {
    return this.elements.map((e) => e.interpret(m));
  }
}

export class SubscriptExpression implements Expression {
  constructor(
    public array: Expression,
    public subscript: Expression
  ) {}
  interpret(m: Memory): Value {
    const arr = this.array.interpret(m);
    const idx = this.subscript.interpret(m);

    if (!isArray(arr)) {
      throw new Error("Target is not an array");
    }
    if (typeof idx !== "number" || !Number.isInteger(idx)) {
      throw new Error("Subscript index must be an integer");
    }
    if (idx < 0 || idx >= arr.length) {
      throw new Error("Array index out of bounds");
    }
    return arr[idx]!;
  }
}

// Statements
export interface Statement {
  interpret([m, o]: State): State;
}

export class VariableDeclaration implements Statement {
  constructor(
    public id: Identifier,
    public expression: Expression
  ) {}
  interpret([m, o]: State): State {
    if (m.has(this.id.name)) {
      throw new Error(`Identifier '${this.id.name}' already declared`);
    }
    const val = this.expression.interpret(m);
    const newMemory = new Map(m);
    newMemory.set(this.id.name, val);
    return [newMemory, o];
  }
}

export class FunctionDeclaration implements Statement {
  constructor(
    public id: Identifier,
    public parameters: Identifier[],
    public expression: Expression
  ) {}
  interpret([m, o]: State): State {
    if (m.has(this.id.name)) {
      throw new Error(`Identifier '${this.id.name}' already declared`);
    }
    const userFn: UserFunction = [this.parameters, this.expression];
    const newMemory = new Map(m);
    newMemory.set(this.id.name, userFn);
    return [newMemory, o];
  }
}

export class Assignment implements Statement {
  constructor(
    public id: Identifier,
    public expression: Expression
  ) {}
  interpret([m, o]: State): State {
    if (!m.has(this.id.name)) {
      throw new Error(`Cannot assign to undeclared variable '${this.id.name}'`);
    }
    if (this.id.name === "pi") {
      throw new Error("Cannot reassign read-only identifier 'pi'");
    }
    const val = this.expression.interpret(m);
    const newMemory = new Map(m);
    newMemory.set(this.id.name, val);
    return [newMemory, o];
  }
}

export class PrintStatement implements Statement {
  constructor(public expression: Expression) {}
  interpret([m, o]: State): State {
    return [m, [...o, this.expression.interpret(m)]];
  }
}

export class WhileStatement implements Statement {
  constructor(
    public expression: Expression,
    public block: Block
  ) {}
  interpret([m, o]: State): State {
    let currentState: State = [m, o];
    while (true) {
      const condVal = this.expression.interpret(currentState[0]);
      if (condVal === false || condVal === 0) {
        break;
      }
      currentState = this.block.interpret(currentState);
    }
    return currentState;
  }
}

// Block
export class Block {
  constructor(public statements: Statement[]) {}
  interpret([m, o]: State): State {
    let state: State = [m, o];
    for (const statement of this.statements) {
      state = statement.interpret(state);
    }
    return state;
  }
}

// Program
export class Program {
  constructor(public block: Block) {}
  interpret(): Output {
    const initialMemory: Memory = new Map<string, Value>([
      ["pi", Math.PI as Value],
      ["sqrt", (Math.sqrt as Value)],
      ["sin", (Math.sin as Value)],
      ["cos", (Math.cos as Value)],
      ["ln", (Math.log as Value)],
      ["exp", (Math.exp as Value)],
      ["hypot", (Math.hypot as Value)],
    ]);
    const [_, o] = this.block.interpret([initialMemory, []]);
    return o;
  }
}

export function interpret(p: Program): Output {
  return p.interpret();
}
