// Declarations
let currOperand = "";
let prevOperand = "";
let currResult = "";
let prevResult = "";
let operator = "";
let resetFlag = false;
let errorFlag = false;

const numBtns = document.querySelectorAll(".num-btn");
const opBtns = document.querySelectorAll(".op-btn");
const result = document.getElementById("result");
const resultBtn = document.querySelector(".result-btn");
const resetBtn = document.querySelector(".reset-btn");
const dltBtn = document.querySelector(".dlt-btn");
const sqrtBtn = document.querySelector(".sqrt-btn");
const buttons = document.querySelectorAll(".button");
const prevResultDiv = document.querySelector("#prev-result");
const currResultDiv = document.querySelector("#curr-result");

// Event Listeners

numBtns.forEach(numBtn => {
	numBtn.addEventListener("click", event => {
		const num = event.target.textContent;
		operandChanged(num);
		updateResult();
	});
});

opBtns.forEach(opBtn => {
	opBtn.addEventListener("click", event => {
		const op = event.target.getAttribute("data-operator");
		operatorChanged(op);
		updateResult();
	});
});

resultBtn.addEventListener("click", event => {
	evaluate();
	resetFlag = true;
});

sqrtBtn.addEventListener("click", getSqrt);
resetBtn.addEventListener("click", reset);
dltBtn.addEventListener("click", deleteOperand);

// Functions

function operandChanged(num) {
	if (resetFlag || errorFlag) {
		resetFlag = false;
		errorFlag = false;
		currOperand = "";
	}

    if (num === ".") {
        // Already includes a decimal
        if (currOperand.includes(".")) return;
        // If No Operand is prepended to decimal, add 0
		if (!currOperand) currOperand += "0";
	}
	currOperand = currOperand.toString() + num;
}

function operatorChanged(op) {
	if (errorFlag) {
		reset();
		errorFlag = false;
	}
    if (resetFlag) {
        // Using the Prev Result, Do not reset
		resetFlag = false;
    }

	if (!currOperand) {
		currOperand = "0";
    }

	evaluate();
	operator = op;
	prevOperand = currOperand;
	currOperand = "";
}

function reset() {
	prevOperand = "";
	currOperand = "";
	prevResult = "";
	currResult = "";
	operator = "";
	updateResult();
}

function deleteOperand() {
    // Remove last character/number from operand
	currOperand = currOperand.slice(0, -1);
	updateResult();
}

function updateResult() {
	prevResult = `${prevOperand} ${operator}`;
    currResult = currOperand;
    // Set Display
	prevResultDiv.textContent = prevResult;
	currResultDiv.textContent = currResult;
}

function evaluate() {
	const parsedCurrOperand = parseFloat(currOperand);
	const parsedPrevOperand = parseFloat(prevOperand);

    // Return if any value is undefined/invalid
	if (isNaN(parsedCurrOperand) || isNaN(parsedPrevOperand) || !operator) {
		return;
    }

	let result;
	switch (operator) {
		case "+":
			result = parsedPrevOperand + parsedCurrOperand;
			break;
		case "-":
			result = parsedPrevOperand - parsedCurrOperand;
			break;
		case "*":
			result = parsedPrevOperand * parsedCurrOperand;
			break;
		case "/":
            if (parsedCurrOperand === 0) {
                // Division by Zero
				reset();
				currResultDiv.textContent = "Zero Division Error";
				errorFlag = true;
				return;
			} else result = parsedPrevOperand / parsedCurrOperand;
			break;
	}
	reset();
	currOperand = result.toString();
	currResult = result;
	updateResult();
}

function getSqrt() {
	if (!currOperand) return;
	const parsedCurrOperand = parseFloat(currOperand);
    if (parsedCurrOperand < 0) {
        // Sqrt of a negative number
		reset();
		currResultDiv.textContent = "Invalid Input";
		errorFlag = true;
	} else {
		const result = Math.sqrt(parsedCurrOperand);
		currOperand = result.toString();
		currResult = result;
		updateResult();
	}
}
