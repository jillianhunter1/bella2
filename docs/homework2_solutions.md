# Homework #2: Programming Language Foundations (Bella 2)
**Course:** CMSI 585  
**Student:** Jillian Hunter  
**Language:** Bella 2  

---

## Problem 1: Operational Semantics for Bella 2

The semantic domain for runtime values $\textsf{Value}$ in Bella 2 extends Bella with Booleans and Arrays:

$$
\frac{}{\mathsf{Undef}\!: \mathsf{Value}}
\quad
\frac{x\!:\mathsf{Real}}{\mathsf{Num}\;x\!: \mathsf{Value}}
\quad
\frac{b\!:\mathsf{Bool}}{\mathsf{Bool}\;b\!: \mathsf{Value}}
\quad
\frac{v_1,\ldots,v_n\!:\mathsf{Value}}{\mathsf{Array}\;[v_1,\ldots,v_n]\!: \mathsf{Value}}
$$

$$
\frac{p\!:\mathsf{Ide}^{*}\;\;\;e\!:\mathsf{Exp}}{\mathsf{Fun}\;p\;e\!: \mathsf{Value}}
\quad
\frac{f\!:\mathsf{Value}^{*} \to \mathsf{Value}}{\mathsf{StdFun}\;f\!: \mathsf{Value}}
$$

The transition evaluation relation for expressions $m \vdash e \Downarrow v$ and state transitions $(m,o) \vdash s \Downarrow (m',o')$ are defined as follows:

### 1. Expressions ($m \vdash e \Downarrow v$)

#### Numerals and Booleans
$$\frac{}{m \vdash \llbracket n \rrbracket \Downarrow \mathsf{Num}\;n}$$

$$\frac{}{m \vdash \llbracket \mathtt{true} \rrbracket \Downarrow \mathsf{Bool}\;\text{true}}$$

$$\frac{}{m \vdash \llbracket \mathtt{false} \rrbracket \Downarrow \mathsf{Bool}\;\text{false}}$$

#### Identifiers
$$\frac{m(i) = v}{m \vdash \llbracket i \rrbracket \Downarrow v}$$

#### Unary Expressions
$$\frac{m \vdash e \Downarrow \mathsf{Num}\;x}{m \vdash \llbracket \mathsf{-}\;e \rrbracket \Downarrow \mathsf{Num}\;(-x)}$$

$$\frac{m \vdash e \Downarrow \mathsf{Bool}\;b}{m \vdash \llbracket \mathsf{!}\;e \rrbracket \Downarrow \mathsf{Bool}\;(\neg b)}$$

$$\frac{m \vdash e \Downarrow \mathsf{Num}\;x \;\;\; x = 0}{m \vdash \llbracket \mathsf{!}\;e \rrbracket \Downarrow \mathsf{Bool}\;\text{true}}$$

$$\frac{m \vdash e \Downarrow \mathsf{Num}\;x \;\;\; x \neq 0}{m \vdash \llbracket \mathsf{!}\;e \rrbracket \Downarrow \mathsf{Bool}\;\text{false}}$$

#### Binary Expressions (Arithmetic & Array Concatenation)
$$\frac{op \in \{\mathsf{+}, \mathsf{-}, \mathsf{*}, \mathsf{/}, \mathsf{\%}, \mathtt{**}\} \;\;\; m \vdash e_1 \Downarrow \mathsf{Num}\;x \;\;\; m \vdash e_2 \Downarrow \mathsf{Num}\;y}{m \vdash \llbracket e_1\;op\;e_2 \rrbracket \Downarrow \mathsf{Num}\;(op(x,y))}$$

$$\frac{m \vdash e_1 \Downarrow \mathsf{Array}\;A_1 \;\;\; m \vdash e_2 \Downarrow \mathsf{Array}\;A_2}{m \vdash \llbracket e_1 \;\mathsf{+}\; e_2 \rrbracket \Downarrow \mathsf{Array}\;(A_1 \mathbin{\Vert} A_2)}$$

#### Binary Relational & Equality
$$\frac{op \in \{\mathtt{<}, \mathtt{<=}, \mathtt{>}, \mathtt{>=}\} \;\;\; m \vdash e_1 \Downarrow \mathsf{Num}\;x \;\;\; m \vdash e_2 \Downarrow \mathsf{Num}\;y}{m \vdash \llbracket e_1\;op\;e_2 \rrbracket \Downarrow \mathsf{Bool}\;(op(x,y))}$$

$$\frac{m \vdash e_1 \Downarrow v_1 \;\;\; m \vdash e_2 \Downarrow v_2}{m \vdash \llbracket e_1 \;\mathtt{==}\; e_2 \rrbracket \Downarrow \mathsf{Bool}\;(v_1 = v_2)}$$

$$\frac{m \vdash e_1 \Downarrow v_1 \;\;\; m \vdash e_2 \Downarrow v_2}{m \vdash \llbracket e_1 \;\mathtt{!=}\; e_2 \rrbracket \Downarrow \mathsf{Bool}\;(v_1 \neq v_2)}$$

#### Short-circuit Logical Operators
$$\frac{m \vdash e_1 \Downarrow v \;\;\; \text{isFalsy}(v)}{m \vdash \llbracket e_1 \;\mathtt{\&\&}\; e_2 \rrbracket \Downarrow v}$$

$$\frac{m \vdash e_1 \Downarrow v \;\;\; \neg\text{isFalsy}(v) \;\;\; m \vdash e_2 \Downarrow v_2}{m \vdash \llbracket e_1 \;\mathtt{\&\&}\; e_2 \rrbracket \Downarrow v_2}$$

$$\frac{m \vdash e_1 \Downarrow v \;\;\; \neg\text{isFalsy}(v)}{m \vdash \llbracket e_1 \;\mathtt{||}\; e_2 \rrbracket \Downarrow v}$$

$$\frac{m \vdash e_1 \Downarrow v \;\;\; \text{isFalsy}(v) \;\;\; m \vdash e_2 \Downarrow v_2}{m \vdash \llbracket e_1 \;\mathtt{||}\; e_2 \rrbracket \Downarrow v_2}$$

Where $\text{isFalsy}(v)$ holds iff $v = \mathsf{Bool}\;\text{false}$ or $v = \mathsf{Num}\;0$.

#### Conditional Expression
$$\frac{m \vdash e \Downarrow v \;\;\; \neg\text{isFalsy}(v) \;\;\; m \vdash e_1 \Downarrow v_1}{m \vdash \llbracket e \;\mathtt{?}\; e_1 \;\mathtt{:}\; e_2 \rrbracket \Downarrow v_1}$$

$$\frac{m \vdash e \Downarrow v \;\;\; \text{isFalsy}(v) \;\;\; m \vdash e_2 \Downarrow v_2}{m \vdash \llbracket e \;\mathtt{?}\; e_1 \;\mathtt{:}\; e_2 \rrbracket \Downarrow v_2}$$

#### Array Literal and Subscripting
$$\frac{(m \vdash e_i \Downarrow v_i)_{i=1}^k}{m \vdash \llbracket \mathtt{[}e_1,\ldots,e_k\mathtt{]} \rrbracket \Downarrow \mathsf{Array}\;[v_1,\ldots,v_k]}$$

$$\frac{m \vdash e_1 \Downarrow \mathsf{Array}\;[v_0,\ldots,v_{k-1}] \;\;\; m \vdash e_2 \Downarrow \mathsf{Num}\;i \;\;\; 0 \leq i < k \;\;\; i \in \mathbb{Z}}{m \vdash \llbracket e_1\mathtt{[}e_2\mathtt{]} \rrbracket \Downarrow v_i}$$

#### Function Call
$$\frac{(m \vdash e_j \Downarrow a_j)_{j=1}^k \;\;\; m(i) = \mathsf{Fun}\;(p_1,\ldots,p_k)\;e' \;\;\; m[p_j \mapsto a_j]_{j=1}^k \vdash e' \Downarrow v}{m \vdash \llbracket \mathtt{call}\;i\;e_1\ldots e_k \rrbracket \Downarrow v}$$

$$\frac{(m \vdash e_j \Downarrow a_j)_{j=1}^k \;\;\; m(i) = \mathsf{StdFun}\;f}{m \vdash \llbracket \mathtt{call}\;i\;e_1\ldots e_k \rrbracket \Downarrow f(a_1,\ldots,a_k)}$$

---

### 2. Statements ($(m,o) \vdash s \Downarrow (m',o')$)

#### Variable & Function Declarations
$$\frac{m \vdash e \Downarrow v \;\;\; m(i) = \mathsf{Undef}}{(m,o) \vdash \llbracket \mathtt{let}\;i=e \rrbracket \Downarrow (m[i \mapsto v], o)}$$

$$\frac{m(i) = \mathsf{Undef}}{(m,o) \vdash \llbracket \mathtt{func}\;i\;p_1\ldots p_k=e \rrbracket \Downarrow (m[i \mapsto \mathsf{Fun}\;(p_1,\ldots,p_k)\;e], o)}$$

#### Assignment & Print
$$\frac{m \vdash e \Downarrow v \;\;\; m(i) \neq \mathsf{Undef} \;\;\; i \neq \mathtt{pi}}{(m,o) \vdash \llbracket i=e \rrbracket \Downarrow (m[i \mapsto v], o)}$$

$$\frac{m \vdash e \Downarrow v}{(m,o) \vdash \llbracket \mathtt{print}\;e \rrbracket \Downarrow (m, o \cdot v)}$$

#### While Loop & Blocks
$$\frac{m \vdash e \Downarrow v \;\;\; \text{isFalsy}(v)}{(m,o) \vdash \llbracket \mathtt{while}\;e\;b \rrbracket \Downarrow (m,o)}$$

$$\frac{m \vdash e \Downarrow v \;\;\; \neg\text{isFalsy}(v) \;\;\; (m,o) \vdash b \Downarrow (m',o') \;\;\; (m',o') \vdash \llbracket \mathtt{while}\;e\;b \rrbracket \Downarrow (m'',o'')}{(m,o) \vdash \llbracket \mathtt{while}\;e\;b \rrbracket \Downarrow (m'',o'')}$$

$$\frac{((m_j,o_j) \vdash s_j \Downarrow (m_{j+1},o_{j+1}))_{j=1}^k}{(m_1,o_1) \vdash \llbracket \mathtt{block}\;s_1,\ldots,s_k \rrbracket \Downarrow (m_{k+1}, o_{k+1})}$$

---

## Problem 2: Denotational Semantics for Bella 2

In Denotational Semantics, syntactic constructs map directly to mathematical functions over semantic domains.

### Semantic Domains
- $\mathbf{Val} = \mathbb{R} + \mathbb{B} + \mathbf{Val}^{*} + (\mathbf{Val}^{*} \to \mathbf{Val})$
- $\mathbf{Mem} = \textsf{Ide} \to \mathbf{Val}_\bot$
- $\mathbf{Out} = \mathbf{Val}^{*}$
- $\mathbf{State} = \mathbf{Mem} \times \mathbf{Out}$

### Semantic Valuation Functions
- $\mathcal{E} : \textsf{Expression} \to \mathbf{Mem} \to \mathbf{Val}$
- $\mathcal{S} : \textsf{Statement} \to \mathbf{State} \to \mathbf{State}$
- $\mathcal{B} : \textsf{Block} \to \mathbf{State} \to \mathbf{State}$
- $\mathcal{P} : \textsf{Program} \to \mathbf{Out}$

---

### Expression Valuation ($\mathcal{E}\llbracket e \rrbracket\,m$)

- $\mathcal{E}\llbracket n \rrbracket\,m = n$
- $\mathcal{E}\llbracket \mathtt{true} \rrbracket\,m = \text{true}$
- $\mathcal{E}\llbracket \mathtt{false} \rrbracket\,m = \text{false}$
- $\mathcal{E}\llbracket i \rrbracket\,m = m(i)$
- $\mathcal{E}\llbracket \mathsf{-}\;e \rrbracket\,m = -\mathcal{E}\llbracket e \rrbracket\,m$
- $\mathcal{E}\llbracket \mathsf{!}\;e \rrbracket\,m = \neg (\text{isTruthy}(\mathcal{E}\llbracket e \rrbracket\,m))$
- $\mathcal{E}\llbracket e_1 \; op \; e_2 \rrbracket\,m = \text{applyOp}(op, \mathcal{E}\llbracket e_1 \rrbracket\,m, \mathcal{E}\llbracket e_2 \rrbracket\,m)$
- $\mathcal{E}\llbracket e_1 \;\mathtt{\&\&}\; e_2 \rrbracket\,m = \text{let } v = \mathcal{E}\llbracket e_1 \rrbracket\,m \text{ in if } \text{isFalsy}(v) \text{ then } v \text{ else } \mathcal{E}\llbracket e_2 \rrbracket\,m$
- $\mathcal{E}\llbracket e_1 \;\mathtt{||}\; e_2 \rrbracket\,m = \text{let } v = \mathcal{E}\llbracket e_1 \rrbracket\,m \text{ in if } \text{isTruthy}(v) \text{ then } v \text{ else } \mathcal{E}\llbracket e_2 \rrbracket\,m$
- $\mathcal{E}\llbracket e \;\mathtt{?}\; e_1 \;\mathtt{:}\; e_2 \rrbracket\,m = \text{if } \text{isTruthy}(\mathcal{E}\llbracket e \rrbracket\,m) \text{ then } \mathcal{E}\llbracket e_1 \rrbracket\,m \text{ else } \mathcal{E}\llbracket e_2 \rrbracket\,m$
- $\mathcal{E}\llbracket \mathtt{[}e_1,\ldots,e_k\mathtt{]} \rrbracket\,m = [\mathcal{E}\llbracket e_1 \rrbracket\,m, \ldots, \mathcal{E}\llbracket e_k \rrbracket\,m]$
- $\mathcal{E}\llbracket e_1\mathtt{[}e_2\mathtt{]} \rrbracket\,m = (\mathcal{E}\llbracket e_1 \rrbracket\,m)[\mathcal{E}\llbracket e_2 \rrbracket\,m]$
- $\mathcal{E}\llbracket i \; e_1 \ldots e_k \rrbracket\,m = (m(i))([\mathcal{E}\llbracket e_1 \rrbracket\,m, \ldots, \mathcal{E}\llbracket e_k \rrbracket\,m])$

---

### Statement & Program Valuation Functions

- $\mathcal{S}\llbracket \mathtt{let}\;i=e \rrbracket\,(m, o) = (m[i \mapsto \mathcal{E}\llbracket e \rrbracket\,m],\, o)$
- $\mathcal{S}\llbracket \mathtt{func}\;i\;p_1\ldots p_k = e \rrbracket\,(m, o) = \left(m\left[i \mapsto \lambda [a_1,\ldots,a_k].\,\mathcal{E}\llbracket e \rrbracket\,(m[p_j \mapsto a_j]_{j=1}^k)\right],\, o\right)$
- $\mathcal{S}\llbracket i = e \rrbracket\,(m, o) = (m[i \mapsto \mathcal{E}\llbracket e \rrbracket\,m],\, o)$
- $\mathcal{S}\llbracket \mathtt{print}\;e \rrbracket\,(m, o) = (m,\, o \mathbin{\cdot} \mathcal{E}\llbracket e \rrbracket\,m)$
- $\mathcal{S}\llbracket \mathtt{while}\;e\;b \rrbracket\,(m, o) = \text{FIX}(\lambda f.\,\lambda (m',o').\,\text{if } \text{isTruthy}(\mathcal{E}\llbracket e \rrbracket\,m') \text{ then } f(\mathcal{B}\llbracket b \rrbracket\,(m',o')) \text{ else } (m',o'))\,(m,o)$
- $\mathcal{B}\llbracket \mathtt{block}\;s_1 \ldots s_k \rrbracket\ = \mathcal{S}\llbracket s_k \rrbracket \circ \cdots \circ \mathcal{S}\llbracket s_1 \rrbracket$
- $\mathcal{P}\llbracket \mathtt{program}\;b \rrbracket = \pi_2(\mathcal{B}\llbracket b \rrbracket\,(m_0, []))$

---

## Problem 3: Bella 2 Interpreter & Test Suite

The interpreter is implemented in TypeScript following the provided skeleton:
- **[src/bella2.ts](file:///Users/jillianhunter/Downloads/CMSI585/bella2/src/bella2.ts)**: Contains the full implementation of expressions, statements, state transformations, and evaluation functions.
- **[test/bella2.test.ts](file:///Users/jillianhunter/Downloads/CMSI585/bella2/test/bella2.test.ts)**: Comprehensive unit test suite using `node:test` and `node:assert/strict` with 100% code coverage.
