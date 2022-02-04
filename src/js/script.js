const inputElement = document.querySelector('.calc__input')
const outputOperationElement = document.querySelector('.calc__operation .value')
const outputResultElement = document.querySelector('.calc__result .value')

const operators = ['+', '-', '*', '/']
const power = 'power('
const sqrt = 'Math.sqrt'
let data = {
    operation: [],
    formula: []
}


const calculatorButtons = [{
        name: 'percent',
        symbol: '%',
        formula: '/100',
        type: 'number'
    },
    {
        name: 'clear',
        symbol: 'C',
        formula: false,
        type: 'key'
    },
    {
        name: 'delete',
        symbol: 'DEL',
        formula: false,
        type: 'key'
    },
    {
        name: 'power',
        symbol: 'x^',
        formula: power,
        type: 'math-function'
    },
    {
        name: 'square-root',
        symbol: '&radic;',
        formula: sqrt,
        type: 'math-function'
    },
    {
        name: '1 divised by',
        symbol: '1/x',
        formula: '1/x',
        type: 'math-function'
    },
    {
        name: 'square',
        symbol: 'x&#178;',
        formula: power,
        type: 'math-function'
    },
    {
        name: 'division',
        symbol: '&#247;',
        formula: '/',
        type: 'operator'
    },
    {
        name: '7',
        symbol: 7,
        formula: 7,
        type: 'number'
    },
    {
        name: '8',
        symbol: 8,
        formula: 8,
        type: 'number'
    },
    {
        name: '9',
        symbol: 9,
        formula: 9,
        type: 'number'
    },
    {
        name: 'multiply',
        symbol: '&#215;',
        formula: '*',
        type: 'operator'
    },
    {
        name: '4',
        symbol: 4,
        formula: 4,
        type: 'number'
    },
    {
        name: '5',
        symbol: 5,
        formula: 5,
        type: 'number'
    },
    {
        name: '6',
        symbol: 6,
        formula: 6,
        type: 'number'
    },
    {
        name: 'minus',
        symbol: '-',
        formula: '-',
        type: 'operator'
    },
    {
        name: '1',
        symbol: 1,
        formula: 1,
        type: 'number'
    },
    {
        name: '2',
        symbol: 2,
        formula: 2,
        type: 'number'
    },
    {
        name: '3',
        symbol: 3,
        formula: 3,
        type: 'number'
    },
    {
        name: 'plus',
        symbol: '+',
        formula: '+',
        type: 'operator'
    },
    {
        name: 'plus/minus',
        symbol: '&#177;',
        formula: -1,
        type: 'operator'
    },
    {
        name: '0',
        symbol: 0,
        formula: 0,
        type: 'number'
    },
    {
        name: 'dot',
        symbol: '.',
        formula: '.',
        type: 'number'
    },
    {
        name: 'calculate',
        symbol: '=',
        formula: '=',
        type: 'calculate'
    },
]

inputElement.addEventListener('click', event => {
    calculatorButtons.forEach(button => {
        if (button.name === event.target.id)
            calculator(button)
    })
})

function calculator(button) {
    if (button.type === 'number') {
        data.operation.push(button.symbol)
        data.formula.push(button.formula)
    } else if (button.type === 'operator') {
        data.operation.push(button.symbol)
        data.formula.push(button.formula)
        if (button.name === 'plus/minus') {
            data.operation.pop()
            data.formula.pop()
            if (data.operation[0] == '-') data.operation.shift()
            else data.operation.unshift('-')
            data.formula.push('*')
            data.formula.push(button.formula)
        }
    } else if (button.type === 'math-function') {
        let symbol, formula
        if (button.name === 'power') {
            symbol = '^('
            formula = button.formula
            data.operation.push(symbol)
            data.formula.push(formula)
        }
        else if (button.name === 'square') {
            symbol = '^('
            formula = button.formula
            data.operation.push(symbol)
            data.formula.push(formula)
            data.operation.push('2)')
            data.formula.push('2)')
        }
         else {
            symbol = button.symbol + '('
            formula = button.formula + '('
            data.operation.push(symbol)
            data.formula.push(formula)
        }
    } else if (button.type === 'calculate') {
        formulaStr = data.formula.join('')
        let powerSearchResult = search(data.formula, power)
        let sqrtSearchResult = search(data.formula, sqrt)
        const bases = powerBaseGetter(data.formula, powerSearchResult)
        const basesSqr = sqrtBaseGetter(data.formula, sqrtSearchResult)
        
        bases.forEach(base => {
            let toReplace = base + power
            let replacement = 'Math.pow(' + base + ',' 
            formulaStr = formulaStr.replace(toReplace, replacement)
            if (formulaStr.includes('Math.pow') && formulaStr.split('')[formulaStr.length -1] !== ')') {
                formulaStr = formulaStr + ')'
            }
        })
        
        basesSqr.forEach(base => {
            let toReplace = base + sqrt
            let replacement = 'Math.sqrt(' + base + ')' 
            formulaStr = formulaStr.replace(toReplace, replacement)
            })

        let result = 0

        if (eval(formulaStr) % 1 !== 0) result = (eval(formulaStr)).toFixed(2)
        else result = eval(formulaStr)
        
        data.operation = []
        data.operation.push(result)
        data.formula = []
        data.formula.push(result)
        updateOperationResult(result)
        

    } else if (button.type === 'key') {
        if (button.name === 'delete') {
            data.formula.pop()
            data.operation.pop()
        }
        if (button.name === 'clear') {
            data.formula = []
            data.operation = []
            updateOperationResult(0)
        }
    }

    updateOperationElement(data.operation.join(''))
}


function updateOperationElement(operation) {
    outputOperationElement.innerHTML = operation
}

function updateOperationResult(result) {
    outputResultElement.innerHTML = result
}

function renderCalculator() {
    const buttonsPerRow = 4
    let addedButtons = 0
    calculatorButtons.forEach(button => {
        if (addedButtons % buttonsPerRow == 0)
            inputElement.innerHTML += `<div class="input__row"></div>`
        let row = document.querySelector('.input__row:last-child')
        row.innerHTML += `<button id="${button.name}" class="btn">${button.symbol}</button>`
        addedButtons++
    })
}

renderCalculator()




function powerBaseGetter(formula, powerSearchResult) {
    let powerBases = []
    powerSearchResult.forEach(powerIndex => {
        let base = []
        let parenthesesCount = 0
        let previousIndex = powerIndex - 1
        while (previousIndex >= 0) {
            if (formula[previousIndex] == '(') parenthesesCount--
            if (formula[previousIndex] == ')') parenthesesCount++
            let isOperator = false
            operators.forEach(operator => {
                if (formula[previousIndex] == operator) isOperator = true
            })
            let isPower = formula[previousIndex] == power

            if ((isOperator && parenthesesCount == 0) || isPower) break;
            base.unshift(formula[previousIndex])
            previousIndex--
        }
        powerBases.push(base.join(''))
    })
    return powerBases
}

function sqrtBaseGetter(formula, sqrtSearchResult) {
    let powerBases = []
    sqrtSearchResult.forEach(powerIndex => {
        let base = []
        let parenthesesCount = 0
        let previousIndex = powerIndex - 1
        while (previousIndex >= 0) {
            if (formula[previousIndex] == '(') parenthesesCount--
            if (formula[previousIndex] == ')') parenthesesCount++
            let isOperator = false
            operators.forEach(operator => {
                if (formula[previousIndex] == operator) isOperator = true
            })
            let isPower = formula[previousIndex] == sqrt

            if ((isOperator && parenthesesCount == 0) || isPower) break;
            base.unshift(formula[previousIndex])
            previousIndex--
        }
        powerBases.push(base.join(''))
    })
    return powerBases
}

function search(array, keyword) {
    let resultArray = []
    array.forEach((element, index) => {
        if (keyword == element) resultArray.push(index)
    })
    return resultArray
}

