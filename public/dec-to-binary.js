const errorToast = document.getElementById('error-toast');
const decimalInput = document.getElementById('decimal-input');
const binaryInput = document.getElementById('binary-input');
const log = document.getElementById('log');

function convertToBinary() {
    const decimalInputValue = decimalInput.value;
    if (isNaN(decimalInputValue) || decimalInputValue === '') {
        errorToast.innerHTML = 'Please enter a valid decimal number.';
        errorToast.className = 'active';
        setTimeout(() => {
            errorToast.innerHTML = '<br><br>';
            errorToast.className = '';
        }, 3000);
        return;
    }

    var binaryResult = parseInt(decimalInputValue, 10).toString(2);
    binaryInput.value = binaryResult;

    logConversion('Decimal to Binary', decimalInputValue, binaryResult);
}

function convertToDecimal() {
    const binaryInputValue = binaryInput.value;
    if (!/^[01]+$/.test(binaryInputValue) || binaryInputValue === '') {
        errorToast.textContent = 'Please enter a valid binary number.';
        errorToast.className = 'active';
        setTimeout(() => {
            errorToast.innerHTML = '<br><br>';
            errorToast.className = '';
        }, 3000);
        return;
    }

    var decimalResult = parseInt(binaryInputValue, 2).toString(10);
    decimalInput.value = decimalResult;

    logConversion('Binary to Decimal', binaryInputValue, decimalResult);
}

function logConversion(type, input, result) {
    const stringToPrint = `${type}: ${input} -> ${result}`;
    console.log(stringToPrint)
    log.innerHTML += '<br>' + stringToPrint;
}