export class Program {
  constructor(public body: Block) {}
}

export class Block {
  constructor(public statements: Statement[]) {}
}

export class VariableDeclaration {
  constructor(
    public name: string,
    public initializer: Expression
  ) {}
}

export class FunctionDeclaration {
  constructor(
    public name: string,
    public params: string[],
    public body: Expression
  ) {}
}

export class Assignment {
  constructor(
    public target: string,
    public source: Expression
  ) {}
}

export class PrintStatement {
  constructor(public argument: Expression) {}
}

export class WhileStatement {
  constructor(
    public condition: Expression,
    public body: Block
  ) {}
}

export class Variable {
  constructor(public name: string) {}
}

export class UnaryExpression {
  constructor(
    public op: string,
    public operand: Expression
  ) {}
}

export class BinaryExpression {
  constructor(
    public op: string,
    public left: Expression,
    public right: Expression
  ) {}
}

export class TernaryExpression {
  constructor(
    public test: Expression,
    public consequent: Expression,
    public alternate: Expression
  ) {}
}

export class FunctionCall {
  constructor(
    public callee: string,
    public args: Expression[]
  ) {}
}

export type Statement = VariableDeclaration | FunctionDeclaration | Assignment | PrintStatement | WhileStatement;

export type Expression = number | boolean | Variable | UnaryExpression | BinaryExpression | TernaryExpression | FunctionCall;
