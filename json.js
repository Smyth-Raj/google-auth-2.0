const numbers = [1, 2, 3, 4];
const squareNumbers = numbers.map(e => e * e)
console.log(squareNumbers)


const words = ["apple", "banana", "cherry", "date"];
const case1 = words.filter(words => words.length <= 5)
console.log(case1);

const arraySum = numbers.reduce((acc, num) => acc + num, 0)
console.log(arraySum)

const fruitWords = words.forEach(fruit => console.log(`fruits & words : ${fruit}`))
const applyFunction = (func, value) => func(value);
const double = (value) => value * 2
console.log(applyFunction(double, 4));

const wrapperFunction = (funct, value) => funct(value)
const tripple = value => value * value * value
const trippleNumber = wrapperFunction(tripple, 5)

console.log(trippleNumber)



const arr = [1, 5, 8, 3, 4, 2]
const squareNumb = arr.map(arr => arr * 2)
console.log(squareNumb)


const nextWord = ["apple", "banana", "cherry", "date"];
const nextWord2 = nextWord.filter(e => e.length >5);
console.log(nextWord2)





