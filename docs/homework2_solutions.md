# Homework #2: Programming Language Foundations (Bella 2)
**Course:** CMSI 585  
**Student:** Jillian Hunter  
**Language:** Bella 2  

---

## Problem 1: Operational Semantics for Bella 2

The semantic domain for runtime values $\textsf{Value}$ in Bella 2 extends Bella with Booleans and Arrays:

$$
\frac{}{\mathsf{Undef} : \mathsf{Value}}
\quad
\frac{x : \mathsf{Real}}{\mathsf{Num}\;x : \mathsf{Value}}
\quad
\frac{b : \mathsf{Bool}}{\mathsf{Bool}\;b : \mathsf{Value}}
\quad
\frac{v_1,\ldots,v_n : \mathsf{Value}}{\mathsf{Array}\;[v_1,\ldots,v_n] : \mathsf{Value}}
$$

$$
\frac{p : \mathsf{Ide}^* \quad e : \mathsf{Exp}}{\mathsf{Fun}\;p\;e : \mathsf{Value}}
\quad
\frac{f : \mathsf{Value}^* \to \mathsf{Value}}{\mathsf{StdFun}\;f : \mathsf{Value}}
$$

The transition evaluation relation for expressions $m \vdash e \Downarrow v$ and state transitions $(m,o) \vdash s \Downarrow (m',o')$ are defined as follows:

### 1. Expressions ($m \vdash e \Downarrow v$)

#### Numerals and Booleans

$$
\frac{}{m \vdash [| n |] \Downarrow \mathsf{Num}\;n}
$$

$$
\frac{}{m \vdash [| \text{true} |] \Downarrow \mathsf{Bool}\;\text{true}}
$$

$$
\frac{}{m \vdash [| \text{false} |] \Downarrow \mathsf{Bool}\;\text{false}}
$$

#### Identifiers

$$
\frac{m(i) = v}{m \vdash [| i |] \Downarrow v}
$$

#### Unary Expressions

$$
\frac{m \vdash e \Downarrow \mathsf{Num}\;x}{m \vdash [| -e |] \Downarrow \mathsf{Num}\;(-x)}
$$

$$
\frac{m \vdash e \Downarrow \mathsf{Bool}\;b}{m \vdash [| !e |] \Downarrow \mathsf{Bool}\;(\neg b)}
$$

$$
\frac{m \vdash e \Downarrow \mathsf{Num}\;x \quad x = 0}{m \vdash [| !e |] \Downarrow \mathsf{Bool}\;\text{true}}
$$

$$
\frac{m \vdash e \Downarrow \mathsf{Num}\;x \quad x \neq 0}{m \vdash [| !e |] \Downarrow \mathsf{Bool}\;\text{false}}
$$

#### Binary Expressions (Arithmetic & Array Concatenation)

$$
\frac{op \in \{+, -, *, /, \%, \text{**}\} \quad m \vdash e_1 \Downarrow \mathsf{Num}\;x \quad m \vdash e_2 \Downarrow \mathsf{Num}\;y}{m \vdash [| e_1\;op\;e_2 |] \Downarrow \mathsf{Num}\;(op(x,y))}
$$

$$
\frac{m \vdash e_1 \Downarrow \mathsf{Array}\;A_1 \quad m \vdash e_2 \Downarrow \mathsf{Array}\;A_2}{m \vdash [| e_1 + e_2 |] \Downarrow \mathsf{Array}\;(A_1 \mathbin{\Vert} A_2)}
$$

#### Binary Relational & Equality

$$
\frac{op \in \{<, \leq, >, \geq\} \quad m \vdash e_1 \Downarrow \mathsf{Num}\;x \quad m \vdash e_2 \Downarrow \mathsf{Num}\;y}{m \vdash [| e_1\;op\;e_2 |] \Downarrow \mathsf{Bool}\;(op(x,y))}
$$

$$
\frac{m \vdash e_1 \Downarrow v_1 \quad m \vdash e_2 \Downarrow v_2}{m \vdash [| e_1 \text{ == } e_2 |] \Downarrow \mathsf{Bool}\;(v_1 = v_2)}
$$

$$
\frac{m \vdash e_1 \Downarrow v_1 \quad m \vdash e_2 \Downarrow v_2}{m \vdash [| e_1 \text{ != } e_2 |] \Downarrow \mathsf{Bool}\;(v_1 \neq v_2)}
$$

#### Short-circuit Logical Operators

$$
\frac{m \vdash e_1 \Downarrow v \quad \text{isFalsy}(v)}{m \vdash [| e_1 \land e_2 |] \Downarrow v}
$$

$$
\frac{m \vdash e_1 \Downarrow v \quad \neg\text{isFalsy}(v) \quad m \vdash e_2 \Downarrow v_2}{m \vdash [| e_1 \land e_2 |] \Downarrow v_2}
$$

$$
\frac{m \vdash e_1 \Downarrow v \quad \neg\text{isFalsy}(v)}{m \vdash [| e_1 \lor e_2 |] \Downarrow v}
$$

$$
\frac{m \vdash e_1 \Downarrow v \quad \text{isFalsy}(v) \quad m \vdash e_2 \Downarrow v_2}{m \vdash [| e_1 \lor e_2 |] \Downarrow v_2}
$$

Where $\text{isFalsy}(v)$ holds iff $v = \mathsf{Bool}\;\text{false}$ or $v = \mathsf{Num}\;0$.

#### Conditional Expression

$$
\frac{m \vdash e \Downarrow v \quad \neg\text{isFalsy}(v) \quad m \vdash e_1 \Downarrow v_1}{m \vdash [| e \; ? \; e_1 : e_2 |] \Downarrow v_1}
$$

$$
\frac{m \vdash e \Downarrow v \quad \text{isFalsy}(v) \quad m \vdash e_2 \Downarrow v_2}{m \vdash [| e \; ? \; e_1 : e_2 |] \Downarrow v_2}
$$

#### Array Literal and Subscripting

$$
\frac{(m \vdash e_i \Downarrow v_i)_{i=1}^k}{m \vdash [| [e_1,\ldots,e_k] |] \Downarrow \mathsf{Array}\;[v_1,\ldots,v_k]}
$$

$$
\frac{m \vdash e_1 \Downarrow \mathsf{Array}\;[v_0,\ldots,v_{k-1}] \quad m \vdash e_2 \Downarrow \mathsf{Num}\;i \quad 0 \leq i < k \quad i \in \mathbb{Z}}{m \vdash [| e_1[e_2] |] \Downarrow v_i}
$$

#### Function Call

$$
\frac{(m \vdash e_j \Downarrow a_j)_{j=1}^k \quad m(i) = \mathsf{Fun}\;(p_1,\ldots,p_k)\;e' \quad m[p_j \mapsto a_j]_{j=1}^k \vdash e' \Downarrow v}{m \vdash [| \text{call}\;i\;e_1\ldots e_k |] \Downarrow v}
$$

$$
\frac{(m \vdash e_j \Downarrow a_j)_{j=1}^k \quad m(i) = \mathsf{StdFun}\;f}{m \vdash [| \text{call}\;i\;e_1\ldots e_k |] \Downarrow f(a_1,\ldots,a_k)}
$$

---

### 2. Statements ($(m,o) \vdash s \Downarrow (m',o')$)

#### Variable & Function Declarations

$$
\frac{m \vdash e \Downarrow v \quad m(i) = \mathsf{Undef}}{(m,o) \vdash [| \text{let } i = e |] \Downarrow (m[i \mapsto v], o)}
$$

$$
\frac{m(i) = \mathsf{Undef}}{(m,o) \vdash [| \text{func } i\;p_1\ldots p_k = e |] \Downarrow (m[i \mapsto \mathsf{Fun}\;(p_1,\ldots,p_k)\;e], o)}
$$

#### Assignment & Print

$$
\frac{m \vdash e \Downarrow v \quad m(i) \neq \mathsf{Undef} \quad i \neq \text{pi}}{(m,o) \vdash [| i = e |] \Downarrow (m[i \mapsto v], o)}
$$

$$
\frac{m \vdash e \Downarrow v}{(m,o) \vdash [| \text{print } e |] \Downarrow (m, o \cdot v)}
$$

#### While Loop & Blocks

$$
\frac{m \vdash e \Downarrow v \quad \text{isFalsy}(v)}{(m,o) \vdash [| \text{while } e\;b |] \Downarrow (m,o)}
$$

$$
\frac{m \vdash e \Downarrow v \quad \neg\text{isFalsy}(v) \quad (m,o) \vdash b \Downarrow (m',o') \quad (m',o') \vdash [| \text{while } e\;b |] \Downarrow (m'',o'')}{(m,o) \vdash [| \text{while } e\;b |] \Downarrow (m'',o'')}
$$

$$
\frac{((m_j,o_j) \vdash s_j \Downarrow (m_{j+1},o_{j+1}))_{j=1}^k}{(m_1,o_1) \vdash [| \text{block } s_1,\ldots,s_k |] \Downarrow (m_{k+1}, o_{k+1})}
$$

---

## Problem 2: Denotational Semantics for Bella 2

In Denotational Semantics, syntactic constructs map directly to mathematical functions over semantic domains.

### Semantic Domains
- $\mathbf{Val} = \mathbb{R} + \mathbb{B} + \mathbf{Val}^* + (\mathbf{Val}^* \to \mathbf{Val})$
- $\mathbf{Mem} = \textsf{Ide} \to \mathbf{Val}_\bot$
- $\mathbf{Out} = \mathbf{Val}^*$
- $\mathbf{State} = \mathbf{Mem} \times \mathbf{Out}$

### Semantic Valuation Functions
- $\mathcal{E} : \textsf{Expression} \to \mathbf{Mem} \to \mathbf{Val}$
- $\mathcal{S} : \textsf{Statement} \to \mathbf{State} \to \mathbf{State}$
- $\mathcal{B} : \textsf{Block} \to \mathbf{State} \to \mathbf{State}$
- $\mathcal{P} : \textsf{Program} \to \mathbf{Out}$

---

### Expression Valuation ($\mathcal{E}[| e |] m$)

- $\mathcal{E}[| n |] m = n$
- $\mathcal{E}[| \text{true} |] m = \text{true}$
- $\mathcal{E}[| \text{false} |] m = \text{false}$
- $\mathcal{E}[| i |] m = m(i)$
- $\mathcal{E}[| -e |] m = -\mathcal{E}[| e |] m$
- $\mathcal{E}[| !e |] m = \neg (\text{isTruthy}(\mathcal{E}[| e |] m))$
- $\mathcal{E}[| e_1 \; op \; e_2 |] m = \text{applyOp}(op, \mathcal{E}[| e_1 |] m, \mathcal{E}[| e_2 |] m)$
- $\mathcal{E}[| e_1 \land e_2 |] m = \text{let } v = \mathcal{E}[| e_1 |] m \text{ in if } \text{isFalsy}(v) \text{ then } v \text{ else } \mathcal{E}[| e_2 |] m$
- $\mathcal{E}[| e_1 \lor e_2 |] m = \text{let } v = \mathcal{E}[| e_1 |] m \text{ in if } \text{isTruthy}(v) \text{ then } v \text{ else } \mathcal{E}[| e_2 |] m$
- $\mathcal{E}[| e \; ? \; e_1 : e_2 |] m = \text{if } \text{isTruthy}(\mathcal{E}[| e |] m) \text{ then } \mathcal{E}[| e_1 |] m \text{ else } \mathcal{E}[| e_2 |] m$
- $\mathcal{E}[| [e_1,\ldots,e_k] |] m = [\mathcal{E}[| e_1 |] m, \ldots, \mathcal{E}[| e_k |] m]$
- $\mathcal{E}[| e_1[e_2] |] m = (\mathcal{E}[| e_1 |] m)[\mathcal{E}[| e_2 |] m]$
- $\mathcal{E}[| i \; e_1 \ldots e_k |] m = (m(i))([\mathcal{E}[| e_1 |] m, \ldots, \mathcal{E}[| e_k |] m])$

---

### Statement & Program Valuation Functions

- $\mathcal{S}[| \text{let } i=e |] (m, o) = (m[i \mapsto \mathcal{E}[| e |] m],\, o)$
- $\mathcal{S}[| \text{func } i\;p_1\ldots p_k = e |] (m, o) = \left(m\left[i \mapsto \lambda [a_1,\ldots,a_k].\,\mathcal{E}[| e |] (m[p_j \mapsto a_j]_{j=1}^k)\right],\, o\right)$
- $\mathcal{S}[| i = e |] (m, o) = (m[i \mapsto \mathcal{E}[| e |] m],\, o)$
- $\mathcal{S}[| \text{print } e |] (m, o) = (m,\, o \mathbin{\cdot} \mathcal{E}[| e |] m)$
- $\mathcal{S}[| \text{while } e\;b |] (m, o) = \text{FIX}(\lambda f.\,\lambda (m',o').\,\text{if } \text{isTruthy}(\mathcal{E}[| e |] m') \text{ then } f(\mathcal{B}[| b |] (m',o')) \text{ else } (m',o'))\,(m,o)$
- $\mathcal{B}[| \text{block } s_1 \ldots s_k |] = \mathcal{S}[| s_k |] \circ \cdots \circ \mathcal{S}[| s_1 |]$
- $\mathcal{P}[| \text{program } b |] = \pi_2(\mathcal{B}[| b |] (m_0, []))$

---

## Problem 3: Bella 2 Interpreter & Test Suite

The interpreter is implemented in TypeScript following the provided skeleton:
- **[src/bella2.ts](file:///Users/jillianhunter/Downloads/CMSI585/bella2/src/bella2.ts)**: Contains the full implementation of expressions, statements, state transformations, and evaluation functions.
- **[test/bella2.test.ts](file:///Users/jillianhunter/Downloads/CMSI585/bella2/test/bella2.test.ts)**: Comprehensive unit test suite using `node:test` and `node:assert/strict` with 100% code coverage.
