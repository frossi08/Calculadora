let currentNumber = ''; //number currently selected by the user

const tokens = []; //where confirmed numbers will be stored

const display = document.querySelector('.display'); //select the display

const buttonsNumbers = document.querySelectorAll('[data-number]'); //select the number buttons

const buttonsOperators = document.querySelectorAll('[data-operator]'); //select the operator buttons

const buttonsActions = document.querySelectorAll('[data-action]'); //select the action buttons


// The function clearAll will remove all items currently on the display.
const clearAll = () => {
    currentNumber = '';
    tokens.length = 0;
    display.textContent = '';
}




// The display will show the stored numbers, the current operator,
// and the number currently being typed.
const updateDisplay = () => {
    display.textContent = tokens.filter(Boolean).join(' ') + (currentNumber ? ' ' + currentNumber : '');
}

// The function deleteLast will remove the last character entered by the user.
const deleteLast = () => {

    if (currentNumber) {

        // remove last digit from the current number
        currentNumber = currentNumber.slice(0, -1);

    } else if (tokens.length > 0) {

        // restore the last stored number
        currentNumber = tokens.pop();

        // remove the last digit
        currentNumber = currentNumber.slice(0, -1);

    }

    updateDisplay();
}

// Add click events to all number buttons.
buttonsNumbers.forEach(button => {
    button.addEventListener('click', () => {
        currentNumber += button.textContent;
        updateDisplay();
    });
});


// Add click events to all operator buttons.
buttonsOperators.forEach(button => {
    button.addEventListener('click', () => {

        // Save the current number before selecting an operator.
        if (currentNumber) {
            tokens.push(currentNumber);

            // Store the selected operator.
            tokens.push(button.textContent);

            currentNumber = '';
        }

        updateDisplay();
    });
});


// Add click events to all action buttons.
buttonsActions.forEach(button => {
    button.addEventListener('click', () => {

        const action = button.dataset.action;

        if (action === 'clear') {
            clearAll();
        }

        if (action === 'del') {
            deleteLast();
        }

    });
});