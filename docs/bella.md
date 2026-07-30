bella








  
    
    
      
        
# The Language Bella


Bella is the second of five languages designed for a compiler course.




## 1  Introduction



Bella is a simple programming language with interesting features that make it a great fit for learning (1) compiler and interpreter writing, and (2) formal language semantics.



The language is limited to numbers, assignments, conditionals, loops, and simple functions. Variables can only hold numbers, not functions. Function “bodies” are limited to simple expressions (like Python lambdas), so we don’t have to deal with any scoping complications like temporal dead zones. Scoping is as in Python: local variables and parameters are function-scoped, and shadowing is allowed. Bella is a friendly, simple language, relatively easy to implement.



This document defines the language Bella.





## 2  Language Description



### 2.1  Programs



A **program**is a sequence of one or more statements.



```bella
let dozen = 12;                                   // variable declaration
print dozen % 3 ** 1;                             // print statement
function gcd(x, y) = y == 0 ? x : gcd(y, x % y);  // function declaration
while dozen >= 3 || (gcd(1, 10) != 5) {           // while statement
  dozen = dozen - 2.75E+19 ** 1 ** 3;             // assignment statement
}

```


Apologies for the semicolons, but they do make the language somewhat easier to parse.



### 2.2  Values and Types



All values in Bella are instances of a **type**. The language has the following types:



The type `number` of IEEE-754 binary64 values.
- The types `function` for all $n \geq 0$, representing functions from $n$ numeric inputs to a single numeric output.



Numbers are first-class values, meaning they can be stored in variables, passed to functions, and returned from functions. Functions cannot be: the only thing one can do with a function is call it.



Numbers are written as in JavaScript:



```bella
2
2.0
55.9
819.999e-15
2E+10
5.89999e2

```


### 2.3  Declarations



A **declaration** binds an identifier to an entity. There are three kinds of declarations:


function declarations
variable declarations
parameter declarations



Here is a short example showing all three kinds:



```bella
let sister = 5 + 1;          // variable declaration of sister (Ⅴ + Ⅰ = Ⅵ)
function triple(x) = x * 3;  // function declaration of triple
                             // ...and parameter declaration of x

```


Each occurrence of an identifier is either a **defining** occurrence or a **using** occurrence. Using occurrences are legal only in the **visible region** of the declaration that declares the identifier. In Bella, **shadowing** of top-level variables by parameters of local functions is permitted, so the visible region of a declaration is the scope minus any "inner" scopes of declarations of identifiers with the same name and may therefore be discontinuous.



The scope of an identifier declared in a parameter declaration is the body of the innermost function in which the parameter declaration appears.

The scope of an identifier declared in a variable declaration begins immediately after its initializer and extends to the end of the program.

The scope of an identifier declared in a function declaration begins immediately after its parameter list and extends to the end of the program.



The identifiers appearing as defining occurrences of variable and function declarations must be mutually exclusive. A function’s parameters must be mutually exclusive as well:



```bella
let x = 3;
// let x = 5;               // ERROR: x already declared
// function x() = 0;        // ERROR: x already declared
// function g(a, a) = 0;    // ERROR: a already declared
function h(x) = 0;          // OK! parameter x shadows global x
// let h = 3;               // ERROR: h already declared (prev line)
function j(k) = π - x;      // OK
let k = 2;                  // OK! Parameter k on prev line not in scope

```


### 2.4  Functions



As a simple language, Bella does not have any anonymous functions; all functions must be named. The identifier used in the function declaration is read-only variable: you cannot reassign it:



```bella
function successor(n) = n + 1;
// let successor = 5;            // ERROR: read only

```


Functions can only be called. They cannot be used in a context where a number is expected:



```bella
function triple (x) = x * 3;
print triple(8);                  // Function call of triple, perfectly fine
// print triple                   // ERROR
// let t = triple;                // ERROR
// let times_nine = triple * 3    // ERROR

```


Functions declared with $n$ parameters must be passed exactly $n$ arguments when called.



### 2.5  Variables



A **variable** is something that stores a value. Variables come into existence either (1) as regular variables declared in a variable declaration statement (using `let`), or (2) as parameters in a parameter declaration. There is one pre-declared variable, $\pi$. Variables can only be used if previously declared.



The variable `π` is read-only and all other variables are writable. Interestingly, because parameters are scoped only to the function body and function bodies are simple expressions, all parameters are effectively read-only.



Variables can store numeric values only, not functions.



### 2.6  Statements



A **statement** is code that is executed solely for its side effect; it produces no value. The kinds of statements are:



`let` $i$ `=` $e$ `;`
(Variable declaration statement)
Declares a new variable with name $i$. This declaration must be unique within its scope. Evaluates $e$ and assigns this value to the new variable. The new variable is writable.

`function` $f$ `(` $x_1, \ldots, x_n$ `) =` $e$ `;`
(Function declaration)
Defines a new function named $f$ with $n$ parameters, that is, its type is `function`. The identifier $f$ must be unique within its scope. The parameters must be unique within their scope.

$i$ `=` $e$ `;`
(Assignment statement)
$e$ is evaluated, then the value of $e$ is copied into $i$. $i$ must have been previously declared and visible in this scope.

`print` $e$ `;`
(Print statement)
Evaluates $e$ then prints its value to standard output.

`while` $e$ $b$
(While statement)
First, $e$ is evaluated. If $e$ produces 0, the execution of the while statement terminates. Otherwise, body $b$ is executed then the entire while statement is executed again.



### 2.7  Expressions



An **expression** produces a numeric. The Bella expressions are:



- A numeric literal.

`true`
Produces 1.

`false`
Produces 0.

- A variable occurrence, which must have been previously declared and visible in this scope.

`-` $e$
Evaluates $e$ and produces the negation of $e$.

`!` $e$
If $e$ evaluates to 0, produces 1, otherwise produces 0.

$e_1$ `*` $e_2$
The subexpressions are evaluated in any order and their product is produced.

$e_1$ `/` $e_2$
The subexpressions are evaluated in any order and their quotient is produced.

$e_1$ `%` $e_2$
The subexpressions are evaluated in any order and the remainder of $e_1$ divided by $e_2$ is produced.

$e_1$ `+` $e_2$
The subexpressions are evaluated in any order and their sum is produced.

$e_1$ `-` $e_2$
The subexpressions are evaluated in any order and their difference is produced.

$e$ `?` $e_1$ `:` $e_2$
Evaluates $e$ and if non-zero, evaluates and produces $e_1$. Otherwise evaluates and produces $e_2$.

$e_1$ `Evaluates the subexpressions in any order, then produces 1 or 0, respectively, as to whether the value of $e_1$ is less than the value of $e_2$.

$e_1$ `Evaluates the subexpressions in any order, then produces 1 or 0, respectively, as to whether the value of $e_1$ is less or equal to the value of $e_2$.

$e_1$ `==` $e_2$
Evaluates the subexpressions in any order, then produces 1 or 0, respectively, as to whether the value of $e_1$ is equal to the value of $e_2$.

$e_1$ `!=` $e_2$
Evaluates the subexpressions in any order, then produces 1 or 0, respectively, as to whether the value of $e_1$ is not equal to the value of $e_2$.

$e_1$ `>=` $e_2$
Evaluates the subexpressions in any order, then produces 1 or 0, respectively, as to whether the value of $e_1$ is greater or equal to the value of $e_2$.

$e_1$ `>` $e_2$
Evaluates the subexpressions in any order, then produces 1 or 0, respectively, as to whether the value of $e_1$ is greater than the value of $e_2$.

$e_1$ `&&` $e_2$
First $e_1$ is evaluated. If it evaluates to 0, the entire expression immediately produces 0 (without evaluating $e_2$). Otherwise $e_2$ is evaluated and the entire expression produces the value of $e_2$.

$e_1$ `||` $e_2$
First $e_1$ is evaluated. If it evaluates to a non-zero value, the entire expression immediately produces this value (without evaluating $e_2$). Otherwise $e_2$ is evaluated and the entire expression produces the value of $e_2$.



## 3  Standard Library



The following identifiers are pre-defined in a scope that surrounds the program. This means that none of these identifiers may be declared anywhere in a program.



`π`
    Read-only variable whose value is the best approximate value of $\pi$.

`function sqrt(x)`
    Returns the square root of $x$.

`function sin(x)`
    Returns the sine of $x$ radians.

`function cos(x)`
    Returns the cosine of $x$ radians.

`function exp(x)`
    Returns $e^x$.

`function ln(x)`
    Returns the natural log of $x$.

`function hypot(x, y)`
    Returns the hypotenuse of a right triangle with sides $|x|$ and $|y|$.



## 4  Formal Syntax



The source of a Bella program is a Unicode string. Here is the syntax given as an Ohm grammar:


bella.ohm
```bella
Bella {
  Program   = Statement+
  Statement = let id "=" Exp ";"                        -- vardec
            | function id Params "=" Exp ";"            -- fundec
            | Exp7_id "=" Exp ";"                       -- assign
            | print Exp ";"                             -- print
            | while Exp Block                           -- while
  Params    = "(" ListOf ")"
  Block     = "{" Statement* "}"

  Exp       = ("-" | "!") Exp7                          -- unary
            | Exp1 "?" Exp1 ":" Exp                     -- ternary
            | Exp1
  Exp1      = Exp1 "||" Exp2                            -- binary
            | Exp2
  Exp2      = Exp2 "&&" Exp3                            -- binary
            | Exp3
  Exp3      = Exp4 ("="|">") Exp4   -- binary
            | Exp4
  Exp4      = Exp4 ("+" | "-") Exp5                     -- binary
            | Exp5
  Exp5      = Exp5 ("*" | "/" | "%") Exp6               -- binary
            | Exp6
  Exp6      = Exp7 "**" Exp6                            -- binary
            | Exp7
  Exp7      = num
            | true
            | false
            | id "(" ListOf ")"               -- call
            | id                                        -- id
            | "(" Exp ")"                               -- parens

  let       = "let" ~idchar
  function  = "function" ~idchar
  while     = "while" ~idchar
  true      = "true" ~idchar
  false     = "false" ~idchar
  print     = "print" ~idchar
  keyword   = let | function | while | true | false
  num       = digit+ ("." digit+)? (("E" | "e") ("+" | "-")? digit+)?
  id        = ~keyword letter idchar*
  idchar    = letter | digit | "_"
  space    += "//" (~"\n" any)*                         -- comment
}

```


## 5  Formal Semantics



The meaning of a Bella program is defined in this section via transition rules in the style of Natural Semantics. It is defined from the following abstract syntax:



$ \begin{array}{l}
n\!: \mathsf{Numeral} \\
i\!: \mathsf{Identifier} \\
e\!: \mathsf{Expression}
          =   n
        \;|\; i
        \;|\; \mathtt{true}
        \;|\; \mathtt{false}
        \;|\; \mathit{unaryop} \; e
        \;|\; e_1 \; \mathit{binop} \; e_2
        \;|\; \mathtt{call} \; i \; e^*
        \;|\; e \; \mathtt{?} \; e_1 \; \mathtt{:} \; e_2 \\
s\!: \mathsf{Statement}
          =   \mathtt{let}\;i = e
        \;|\; \mathtt{func}\;i\;i^*=e
        \;|\; i = e
        \;|\; \mathtt{print}\;e
        \;|\; \mathtt{while}\;e\;b \\
b\!: \mathsf{Block} = \mathtt{block}\; s^* \\
p\!: \mathsf{Program} = \mathtt{program}\; b
\end{array} $


The unary operators are
`-` and
`!`.
The binary operators are
`+`,
`-`,
`*`,
`/`,
`%`,
`**`,
`=`,
`>`,
`&&`,
and `||`.


The meaning of a Astro program at runtime is the list of values it prints. To formally specify this behavior, we also have to define the meanings of statements and expressions. We do this with the help of a **memory**, which maps identifiers to their runtime values, and the **output**, which is the list of values output so far. The type $\textsf{Value}$ is defined as:
$$
\frac{}{\mathsf{Undef}\!: \mathsf{Value}}
\quad
\frac{x\!:\mathsf{Real}\;\;\;b\!:\mathsf{Bool}}{\mathsf{Num}\;x\;b\!:\mathsf{Value}}
\quad
\frac{p\!:\mathsf{Ide^*}\;\;\;e\!:\mathsf{Exp}}{\mathsf{Fun}\;p\;e\!:\mathsf{Value}}
\quad
\frac{f\!:\mathsf{Real^* \rightarrow Real}\;\;\;n\!:\mathsf{Nat}}{\mathsf{StdFun}\;f\;n\!:\mathsf{Value}}
$$
allowing identifiers to be (1) bound to a variable with a mutability flag, (2) bound to a (built-in, or “standard”) function together with its parameter count (so that the number of arguments can be checked at call time), (3) a user-defined function with a parameter list and a body expression, or (4) not yet defined. The predefined types $\mathsf{Bool}$, $\mathsf{Nat}$, and $\mathsf{Real}$ refer to booleans, natural numbers, and IEEE-754 binary64 values, respectively. Each statement is executed in the context of a **state**, which is the current memory together with the output so far. Expressions need only be evaluated in the context of the current memory, as they do not read nor modify the output. The semantic rules are:



  
  $$\frac{}{ m \vdash [\![n]\!]  \Downarrow n}$$
  

  
  $$\frac{}{ m \vdash [\![\mathtt{true}]\!] \Downarrow 1}$$
  

  
  $$\frac{}{ m \vdash [\![\mathtt{false}]\!] \Downarrow 0}$$
  

  
  $$\frac{m(i) = \mathsf{Num}\;x\;b}
  {m \vdash [\![i]\!] \Downarrow x}$$
  

  
  $$\frac{ m \vdash e \Downarrow x}
  {m \vdash [\![\mathsf{-}\;e]\!] \Downarrow -x}$$
  

  
  $$\frac{ m \vdash e \Downarrow x\;\;\; x \neq 0}
  {m \vdash [\![\mathsf{!}\;e]\!] \Downarrow 0}$$
  

  
  $$\frac{ m \vdash e  \Downarrow 0}
  {m \vdash [\![\mathsf{!}\;e]\!] \Downarrow 1}$$
  

  
  $$\frac{\begin{gathered}
          op \in \{ \mathsf{+}, \mathsf{-}, \mathsf{*},
          \mathsf{/}, \mathsf{\%}, \mathtt{**}\}  \\
           m \vdash e_1 \Downarrow x \;\;\;
           m \vdash e_2 \Downarrow y \end{gathered}}
  {m \vdash [\![e_1\;op\;e_2]\!] \Downarrow op(x,y)}$$
  

  
  $$\frac{\begin{gathered}
          op \in \{\mathtt{=}, \mathtt{>} \}  \\
           m \vdash e_1 \Downarrow x \;\;\;
           m \vdash e_2 \Downarrow y \;\;\; op(x,y) \end{gathered}}
   {m \vdash [\![e_1\;op\;e_2]\!] \Downarrow 1}$$
  

  
  $$\frac{\begin{gathered}
          op \in \{\mathtt{=}, \mathtt{>} \}  \\
           m \vdash e_1 \Downarrow x \;\;\;
           m \vdash e_2 \Downarrow y \;\;\; \neg op(x,y) \end{gathered}}
   {m \vdash [\![e_1\;op\;e_2]\!] \Downarrow 0}$$
  

  
  $$\frac{ m \vdash e_1 \Downarrow 0}
  {m \vdash [\![e_1\;\mathtt{\&\&}\;e_2]\!] \Downarrow 0}$$
  

  
  $$\frac{ m \vdash e_1 \Downarrow x \;\;\;\; x \neq 0 \;\;\;\; m \vdash e_2 \Downarrow y}
  {m \vdash [\![e_1\;\mathtt{\&\&}\;e_2]\!] \Downarrow y}$$
  

  
  $$\frac{ m \vdash e_1 \Downarrow x \;\;\;\; x \neq 0}
  {m \vdash [\![e_1\;\mathtt{|\,|}\;e_2]\!] \Downarrow x}$$
  

  
  $$\frac{ m \vdash e_1 \Downarrow 0 \;\;\;\;  m \vdash e_2 \Downarrow y}
  {m \vdash [\![e_1\;\mathtt{|\,|}\;e_2]\!] \Downarrow y}$$
  

  
  $$\frac{ m \vdash e \Downarrow x \;\;\;
          x \neq 0 \;\;\;
          m \vdash e_1 \Downarrow y}
  {m \vdash [\![e \; \mathtt{?} \; e_1 \; \mathtt{:} \; e_2]\!] \Downarrow y}$$
  

  
  $$\frac{ m \vdash e \Downarrow 0 \;\;\;  m \vdash e_2 \Downarrow z}
  {m \vdash [\![e \; \mathtt{?} \; e_1 \; \mathtt{:} \; e_2]\!] \Downarrow z}$$
  

  
  $$\frac{( m \vdash e_i \Downarrow a_i)_{i=1}^n  \;\;\;
          m(i) = \mathsf{Fun}\;(p_1,\ldots, p_n)\;e' \;\;\;
           m[p_i \mapsto a_i]_{i=1}^n \vdash e' \Downarrow x}
  { m \vdash [\![ \mathtt{call}\;i\;e_1,\ldots,e_n]\!] \Downarrow x}$$
  

  
  $$\frac{( m \vdash e_i \Downarrow a_i)_{i=1}^n  \;\;\;
      m(i) = \mathsf{StdFun}\;f\;n}
  { m \vdash [\![\mathtt{call}\;i\;e_1,\ldots,e_n]\!] \Downarrow f(a_1,\ldots, a_n)}$$
  

  
  $$\frac{ m \vdash e \Downarrow x\;\;\;\; m(i) = \mathsf{Undef}}
  { (m,o) \vdash [\![\mathtt{let}\;i=e]\!] \Downarrow
    (m[i \mapsto \mathsf{Num}\;x\;\mathsf{true}], o)}$$
  

  
  $$\frac{m(i) = \mathsf{Undef}}
  { (m,o) \vdash [\![\mathtt{fun}\;i\;(p_1,\ldots,p_n)=e]\!] \Downarrow
      (m[i \mapsto \mathsf{Fun}\;(p_1,\ldots,p_n)\;e], o)}$$
  

  
  $$\frac{ e,m \Downarrow x \;\;\;
      m(i) = (\mathsf{Num}\;y\;\mathsf{true})}
  { (m,o) \vdash [\![i=e]\!] \Downarrow
      (m[i \mapsto (\mathsf{Num}\;x\;\mathsf{true})], o)}$$
  

  
  $$\frac{ m \vdash e \Downarrow x}
  { (m,o) \vdash [\![\mathtt{print}\;e]\!] \Downarrow (m, o \cdot x)}$$
  

  
  $$\frac{ m \vdash e  \Downarrow 0}
  { (m,o) \vdash [\![\mathtt{while}\;e\;b]\!] \Downarrow (m, o)}$$
  

  
  $$\frac{\begin{gathered}
           m \vdash e \Downarrow x \;\;\; x \neq 0 \;\;\;
           (m,o) \vdash b \Downarrow (m',o') \\
           (m',o') \vdash [\![\mathtt{while}\;e\;b]\!]
            \Downarrow (m'',o'')\end{gathered}}
  { (m,o) \vdash [\![\mathtt{while}\;e\;b]\!]  \Downarrow (m'',o'')}$$
  

  
  $$\frac{( (m_i,o_i) \vdash s_i  \Downarrow (m_{i+1},o_{i+1}))_{i=1}^n}
  { (m_1,o_1) \vdash [\![\mathtt{block}\;s_1,\ldots,s_n]\!] \Downarrow o_{n+1}}$$
  

  
  $$\frac{ (m_0, o_0) \vdash b \Downarrow (m,o)}
  {[\![\mathtt{program}\;b]\!] \Downarrow o}$$
  



where $o_0$, the initial output, is defined to be the empty sequence, and the initial memory, $m_0$, is the “standard library” defined as follows:


$\begin{array}{l}
m_0 = (\lambda\,i.\;\mathsf{Undef}) [ \\
\quad \mathtt{π} \mapsto \mathsf{Num}\;\pi\;\mathsf{false}][ \\
\quad \mathtt{sqrt} \mapsto \mathsf{Fun}\;(\lambda x.\sqrt{x})\;1][ \\
\quad \mathtt{sin} \mapsto \mathsf{Fun}\;\textrm{sin}\;1][ \\
\quad \mathtt{cos} \mapsto \mathsf{Fun}\;\textrm{cos}\;1][ \\
\quad \mathtt{exp} \mapsto \mathsf{Fun}\;(\lambda x.e^x)\;1][ \\
\quad \mathtt{ln} \mapsto \mathsf{Fun}\;\textrm{ln}\;1][ \\
\quad \mathtt{hypot} \mapsto \mathsf{Fun}\;(\lambda (x,y).\sqrt{x^2+y^2})\;2] \\
\end{array}$