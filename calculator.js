let currentNumber = ''; // number currently selected by the user

const tokens = []; // where confirmed numbers and operators will be stored

const OPERATORS = ['+', '-', '×', '÷'];

const display = document.querySelector('.display'); // select the display

const buttonsNumbers = document.querySelectorAll('[data-number]'); // select the number buttons

const buttonsOperators = document.querySelectorAll('[data-operator]'); // select the operator buttons

const buttonsActions = document.querySelectorAll('[data-action]'); // select the action buttons


// The function clearAll will remove all items currently on the display.
const clearAll = () => {
    currentNumber = '';
    tokens.length = 0;
    updateDisplay();
};


// The display will show stored numbers and operators
// and the number currently being typed.
const updateDisplay = () => {

    const text =
        tokens.join(' ') +
        (currentNumber ? ' ' + currentNumber : '');

    display.textContent = text.trim() || '0';
};


// Format floating-point results.
const formatResult = (value) => {
    return Number(parseFloat(value.toFixed(10)));
};


// The function deleteLast will remove the last character entered by the user.
const deleteLast = () => {

    if (currentNumber) {

        // remove last digit from the current number
        currentNumber = currentNumber.slice(0, -1);

    } else if (tokens.length > 0) {

        const lastToken = tokens.pop();

        // if the last token is an operator
        if (OPERATORS.includes(lastToken)) {

            // restore the previous number so the user can continue typing
            currentNumber = tokens.pop() || '';
        }
    }

    updateDisplay();
};


// Performs a mathematical operation.
const operate = (num1, operator, num2) => {

    let result;

    switch (operator) {

        case '+':
            result = num1 + num2;
            break;

        case '-':
            result = num1 - num2;
            break;

        case '×':
            result = num1 * num2;
            break;

        case '÷':

            if (num2 === 0) {
                throw new Error('Division by zero');
            }

            result = num1 / num2;
            break;

        default:
            throw new Error('Invalid operator');
    }

    return formatResult(result);
};


// Calculate the full expression respecting operator precedence.
const calculate = (items) => {

    const expression = [...items];

    // Pass 1: multiplication and division
    let i = expression.findIndex(
        item => ['×', '÷'].includes(item)
    );

    while (i !== -1) {

        const result = operate(
            Number(expression[i - 1]),
            expression[i],
            Number(expression[i + 1])
        );

        expression.splice(i - 1, 3, result);

        i = expression.findIndex(
            item => ['×', '÷'].includes(item)
        );
    }

    // Pass 2: addition and subtraction
    while (expression.length > 1) {

        const result = operate(
            Number(expression[0]),
            expression[1],
            Number(expression[2])
        );

        expression.splice(0, 3, result);
    }

    if (expression.length === 0) {
        return 0;
    }

    return formatResult(Number(expression[0]));
};


// Add click events to all number buttons.
buttonsNumbers.forEach(button => {
    button.addEventListener('click', () => {

        const value = button.dataset.number;

        // prevent multiple decimal points
        if (
            value === '.' &&
            currentNumber.includes('.')
        ) {
            return;
        }

        // prevent multiple leading zeros
        if (
            currentNumber === '0' &&
            value !== '.'
        ) {
            currentNumber = value;
            updateDisplay();
            return;
        }

        currentNumber += value;

        updateDisplay();
    });
});


// Add click events to all operator buttons.
buttonsOperators.forEach(button => {
    button.addEventListener('click', () => {

        if (!currentNumber && tokens.length === 0) {
            return;
        }

        // Save current number before selecting an operator
        if (currentNumber) {
            tokens.push(currentNumber);
            currentNumber = '';
        }

        const operator = button.textContent.trim();

        const lastToken = tokens[tokens.length - 1];

        // Replace existing operator
        if (OPERATORS.includes(lastToken)) {

            tokens[tokens.length - 1] = operator;

        } else {

            // Store selected operator
            tokens.push(operator);
        }

        updateDisplay();
    });
});


// Add click events to all action buttons.
buttonsActions.forEach(button => {
    button.addEventListener('click', () => {

        const action = button.dataset.action;

        switch (action) {

            case 'clear':
                clearAll();
                break;

            case 'del':
                deleteLast();
                break;

            case 'equal': {

                const lastToken = tokens[tokens.length - 1];

                // Ignore incomplete expressions:
                // 5 +
                // 5 + 3 ×
                if (
                    !currentNumber &&
                    OPERATORS.includes(lastToken)
                ) {
                    break;
                }

                try {

                    const expression = [...tokens];

                    if (currentNumber !== '') {
                        expression.push(currentNumber);
                    }

                    if (expression.length === 0) {
                        break;
                    }

                    const result = calculate(expression);

                    tokens.length = 0;
                    currentNumber = String(result);

                    updateDisplay();

                } catch (error) {

                    tokens.length = 0;
                    currentNumber = '';

                    display.textContent = 'Error';
                }

                break;
            }
        }
    });
});


// Initial display state
updateDisplay();