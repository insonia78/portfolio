import './style.css';

const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `Instructions: answer each question by writing to console.log
  <br> 
  <br>
  View the output in the console in the bottom right`;

/*

  Instructions
  Answer each question by writing to console.log
  This should take about 4 mins

  View the output in the console in the bottom right

  EXAMPLE:

  Question: Add an exclamation to the end of a string `text`

  Your Answer: console.log(`${text}!`);

  Submitting your code:
  Copy the entire index.ts file contents and send them to submit your work

 */

//
// PART 1 - Strings
// Using the string variable text... write each answer to console.log
//

const text = 'I am a master at strings';

// 1 - Replace first occurence of the letter 'a' with the letter 'z'
console.log('1: ' + text.replace('a','z'));

// 2 - Replace all occurences of the letter 'a' with the letter 'z'
console.log('2: ' + text.replaceAll('a','z'));

// 3 - Print 0-based position of the first letter 'm'
console.log('3: ' + text.indexOf('m'));

//
// PART 2 - Arrays
// Using the number variable list... write each answer to console.log
//

const list = [2, 6, 3, 7, 9];

// 4 - Sum only the ODD numbers in the list
const sum = 0;
console.log('4: ' + list.reduce((a,c)=> c % 2 === 0 ? 0 : a + c, sum  ));

// 5 - Sort the list highest to lowest
console.log('5: ' + list.slice().sort((a,b)=> b -a ));

// 6 - Print the numbers in a ~ delimited string like '1~2~3'
console.log('6: ' + list.join("~"));
