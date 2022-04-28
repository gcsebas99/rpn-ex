const ADDITION = '+';
const SUBTRACTION = '-';
const MULTIPLICATION = '*';
const DIVISION = '/';
const OPERATORS = [ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION];

/**
 * RPN
 * Calculator for CLI based on reverse polish notation
 */
const RPN = () => {
  let calculatorStack;

  const init = () => {
    //clear stack
    calculatorStack = [];
    //return init messages
    return [
      '-BR-',
      'Welcome to RPN Calculator!', 
      '-BR-',
      'Please notice,', 
      'if you want to quit type "exit"', 
      'if you want to reset calculator type "reset"', 
      'Any unknown or ilegal expression will be ignored', 
      'and it will not affect the operation in progress!',
      '-BR-',
    ];
  };

  const processInput = text => {
    const trimmedText = text.trim();
    if(trimmedText === 'exit') {
      return ['Thanks for using RPN Calculator', 'HALT'];
    }
    if(trimmedText === 'reset') {
      calculatorStack = [];
      return [printStackResult(), ''];
    }
    if(trimmedText.length > 0) {
      return [attemptProcessExpression(trimmedText), ''];
    } else {
      return ['', ''];
    }
  };

  /**
   * Print methods
   */
  const printStackResult = () => {
    if(calculatorStack.length > 0) {
      return '' + calculatorStack[calculatorStack.length - 1];
    } else {
      return '0';
    }
  };

  const printUnprocessable = type => {
    switch (type) {
      case 1:
        return '(The input is not recognized)';
      case 2:
        return '(There are not enough values to process the operation)';
      case 3:
        return '(One of the values is unprocessable by operator)';
      case 4:
        return '(One of the values is not a number or operator)';
      default:
        return '(Unprocessable input)';
    }
  };

  /**
   * Validations
   */
  const isNumber = text => {
    return !isNaN(text) && text.length > 0;
  };

  const isOperator = text => {
    return OPERATORS.indexOf(text) >= 0;
  };

  const isValidValue = text => {
    return isNumber(text) || isOperator(text);
  };

  const isValidResult = result => {
    return !(result === Infinity) && !isNaN(result);
  };

  const allPartsValid = parts => {
    return parts.every(isValidValue);
  };

  /**
   * Stack
   */
  const addToStack = (stack, value) => {
    stack.push(parseFloat(value, 10));
  };

  const stackCanOperate = stack => {
    return stack.length >= 2;
  };

  /**
   * Calculator processing
   */
  const attemptProcessExpression = text => {
    const chunks = text.split(' ');
    if(chunks.length === 1) { //single value or operator
      return processSingleValueExpression(chunks[0]);
    } else {
      return processComplexExpression(chunks);
    }
  };

  const processSingleValueExpression = value => {
    if(isNumber(value)) {
      addToStack(calculatorStack, value);
      return printStackResult();
    } else if(isOperator(value)) {
      if (stackCanOperate(calculatorStack)) {
        if(executeSingleOperation(calculatorStack, value)) {
          return printStackResult();
        } else {
          return printUnprocessable(3);
        }
      } else {
        return printUnprocessable(2);
      }
    } else {
      return printUnprocessable(1);
    }
  };

  const processComplexExpression = expression => {
    if(allPartsValid(expression)) {
      return executeInBackupBuffer(expression);
    } else {
      return printUnprocessable(4);
    }
  };

  const executeSingleOperation = (stack, operator) => {
    const [valid, result] = evaluateOperation(stack[stack.length - 2], stack[stack.length - 1], operator);
    if(valid) {
      stack.splice(-2);
      addToStack(stack, result);
    }
    return valid;
  };

  const executeInBackupBuffer = expression => {
    let backupBuffer = [...calculatorStack];
    let error = 0;
    let operationValid;
    expression.some(value => {
      if(isNumber(value)) {
        addToStack(backupBuffer, value);
      } else { //must be operator
        if (stackCanOperate(backupBuffer)) {
          operationValid = executeSingleOperation(backupBuffer, value);
          if(!operationValid) {
            error = 3;
          }
        } else {
          error = 2;
        }
      }
      return error !== 0;
    });
    if(error === 0) {
      calculatorStack = backupBuffer;
      return printStackResult();
    } else {
      return printUnprocessable(error);
    }
  };

  /**
   * Arithmetic operations
   */
  const evaluateOperation = (value1, value2, operator) => {
    let result;
    switch(operator) {
      case ADDITION:
        result = value1 + value2;
        break;
      case SUBTRACTION:
        result = value1 - value2;
        break;
      case MULTIPLICATION:
        result = value1 * value2;
        break;
      case DIVISION:
        result = value1 / value2;
        break;
      default:
        break;
    }
    return [isValidResult(result), result];
  };

  /**
   * program interface
   */
  return {
    displayName: 'rpn',
    init: init,
    processInput: processInput,
  }
};

export default RPN;