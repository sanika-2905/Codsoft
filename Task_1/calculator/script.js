
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
    historyValue: ''
};

function updateDisplay() {
    const display = document.querySelector('#display');
    const historyDisplay = document.querySelector('#calculation-history');
    
    display.value = calculator.displayValue;
    historyDisplay.textContent = calculator.historyValue;
}
updateDisplay();


const displayInput = document.querySelector('#display');
if (displayInput) {
    displayInput.addEventListener('keydown', (event) => {
        event.preventDefault(); 
    });
}

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) return;

    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    if (target.classList.contains('equal-sign')) {
        handleEqual();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

const symbolMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && calculator.waitingForSecondOperand)  {
        calculator.operator = nextOperator;
        calculator.historyValue = `${firstOperand} ${symbolMap[nextOperator]}`;
        return;
    }

    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
        calculator.historyValue = `${inputValue} ${symbolMap[nextOperator]}`;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);
        calculator.displayValue = String(result);
        calculator.firstOperand = result;
        calculator.historyValue = `${result} ${symbolMap[nextOperator]}`;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') return firstOperand + secondOperand;
    if (operator === '-') return firstOperand - secondOperand;
    if (operator === '*') return firstOperand * secondOperand;
    if (operator === '/') {
        return secondOperand !== 0 ? firstOperand / secondOperand : 'Error';
    }
    return secondOperand;
}

function handleEqual() {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    if (operator && !calculator.waitingForSecondOperand) {
        const result = calculate(firstOperand, inputValue, operator);
        
        calculator.historyValue = `${firstOperand} ${symbolMap[operator]} ${inputValue} =`;
        calculator.displayValue = String(result);
        
        calculator.firstOperand = null;
        calculator.operator = null;
        calculator.waitingForSecondOperand = false;
    }
}

function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
    calculator.historyValue = '';
}



document.addEventListener('keydown', (event) => {
    const key = event.key;

    
    if (/[0-9]/.test(key)) {
        inputDigit(key);
        updateDisplay();
        return;
    }

    
    if (key === '+' || key === '-' || key === '*' || key === '/') {
        handleOperator(key);
        updateDisplay();
        return;
    }

    
    if (key === 'Enter' || key === '=') {
        event.preventDefault(); 
        handleEqual();
        updateDisplay();
        return;
    }

    
    if (key === 'Escape' || key === 'Delete') {
        resetCalculator();
        updateDisplay();
        return;
    }

    
    if (key === 'Backspace') {
        const { displayValue } = calculator;
        if (displayValue.length > 1) {
            calculator.displayValue = displayValue.slice(0, -1);
        } else {
            calculator.displayValue = '0';
        }
        updateDisplay();
        return;
    }
});