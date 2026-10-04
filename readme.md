# Calculator

A responsive calculator built with **vanilla HTML, CSS and JavaScript** — no frameworks, no libraries, and no `eval()`.

It respects mathematical operator precedence: `12 + 5 × 2` returns `22`, not `34`.

<!-- Add a screenshot or GIF here: ![Calculator preview](./preview.png) -->

## Features

- Addition, subtraction, multiplication and division
- Correct operator precedence (`×` and `÷` are solved before `+` and `-`)
- Chained expressions with any number of operands (`2 + 3 × 4 - 6 ÷ 2`)
- Decimal numbers, with protection against multiple decimal points
- Floating-point rounding (`0.1 + 0.2` displays `0.3`)
- Clear (`C`) and delete last (`⌫`) buttons
- Division by zero handling (displays `Error`)
- Replaces the previous operator when two operators are pressed in a row
- Ignores incomplete expressions (`5 +` followed by `=`)
- Starts a new number when typing right after a result

## Technologies

- HTML5 (semantic structure, `data-*` attributes as JavaScript hooks)
- CSS3 (Grid layout, CSS variables, gradients, transitions)
- JavaScript (ES6+)

## Getting started

Clone the repository:

```bash
git clone https://github.com/frossi08/Calculadora.git
cd Calculadora
```

Or, using SSH:

```bash
git clone git@github.com:frossi08/Calculadora.git
cd Calculadora
```

Then open `index.html` in your browser. No build step or dependencies required.

## Project structure

```text
Calculadora/
├── index.html
├── style.css
├── calculator.js
└── README.md
```

## How it works

The expression is not calculated while the user types. Instead, it is stored as a list of **tokens**, and only solved when `=` is pressed.

```text
User types:  1 2 + 5 × 2

tokens        → ['12', '+', '5', '×']
currentNumber → '2'
```

When `=` is pressed, the list is solved in **two passes**:

```text
Pass 1 (× and ÷):   ['12', '+', '5', '×', '2']  →  ['12', '+', 10]
Pass 2 (+ and -):   ['12', '+', 10]             →  22
```

Each step replaces three items (`number`, `operator`, `number`) with the result using `Array.prototype.splice`.

### Code organization

| Section | Responsibility |
|---|---|
| Constants | Operator symbols and configuration |
| State | `tokens`, `currentNumber`, `isResultDisplayed` |
| Calculation | Pure functions (`operate`, `calculate`) with no DOM access |
| Display | Renders the current state on screen |
| Actions | Handlers for digits, operators, delete, clear and equals |
| Event listeners | Connects the buttons to the actions |

Keeping the calculation functions free of DOM access makes them easy to test on their own.

## Possible improvements

- Keyboard support
- Percentage and sign toggle (`±`) buttons
- Calculation history
- Automated tests for `calculate` and `operate`

## Author

**Felipe Rossi**
[GitHub](https://github.com/frossi08) · [Repository](https://github.com/frossi08/Calculadora)
