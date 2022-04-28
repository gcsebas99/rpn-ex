# rpn-ex

Code exercise from: https://gist.github.com/dennisbaskin/5979ff6a0d8c1e90b59d060155862767

The exercise resolved in this project simulates a unix-like terminal in the browser and executes a reverse polish notation calculator "program".

Credits: Sebastián Gamboa (https://www.linkedin.com/in/sebastiangc/)

Check running app at https://gcsebas99.github.io/rpn-ex/

## Initial analisys and investigation
The following questions and topics were analized previously in order to resolve the exercise:

- What is RPN? 
  - https://en.wikipedia.org/wiki/Reverse_Polish_notation
  - https://www.techopedia.com/definition/9194/reverse-polish-notation-rpn#:~:text=Polish%20Notation%20(RPN)-,What%20Does%20Reverse%20Polish%20Notation%20(RPN)%20Mean%3F,brackets%20to%20define%20evaluation%20priority.
- Can I simulate a terminal in web?
  - Inspiration for terminal: https://bellard.org/jslinux/vm.html?url=alpine-x86.cfg&mem=192
- RPN calculator for reference and testing
  - https://wisdomsky.github.io/reverse-polish-notation-js-parser/
- How much time do I want to invest in this exercise? What can I do in that period of time?
  - As it is a short exercise, I want to invest no more than 15h
- I want to add a text-to-ascii banner for terminal title
  - https://www.tecmint.com/create-ascii-text-banners-in-linux-terminal/


## Project decisions
As I worked in the project, these were some technical decisions I've made:

- Technology
  - I decided to resolve the exercise using javascript and ReactJs
- Solution and features offered 
  - Since I'm planning to apply for a frontend position, I want to show my expertise in frontend technologies, and considering this exercise is about a
    command-line application, I'm planning to simulate a command-line window in a web page and "run" the calculator into that terminal
  - My initial plan is to divide the work into two main milestones: create the terminal with really basic features and creathe a pseudo-program for the RPN calculator.
- The time I want to invest in the exercise: 13h ~ 15h

## Planning
The following list show the main tasks and estimations required to complete the exercise.

1. terminal (~5h)
  - Basic look&feel
  - I/O (enable input, cursor style)
  - pseudo directory (which programs are available)
  - Commands
      - Handle empty return
    - Handle errors and wrong inputs
      - Handle valid inputs (help, ls, run, clear)

2. RPN Calculator (~6h)
  - Data structure - memory stack
  - Calculator logic (memory management and operators)
  - Inputs
      - Handle errors and invalid inputs
      - Process valid values/expressions
      - Handle exit and clear
    - Display calculator output

3. Change style program (~1h)

4. Testing (~2h)

Other tasks related to planning:

- Identify required classes
  - Terminal (main class or App.js) 
      - This class will display terminal window and handle I/O
  - Calculator (class that simulates the calculator program)
      - Receives input, perform arithmetic operations and generate output
  - Change style (class that simulates the skin program)
      - Set flag in terminal to change skin 
  - Utilities file
      - Might be required

- Identify elements in interface
  - Terminal container with scroll
  - List of commands and execution results (output)
  - Input line (input field, always last line)


## Implementation
As I worked on the exercise, I made a few reasonings to complete some of the required tasks.

For the terminal setup, I came across these questions: 

- how is my fake program structure? 
  - I need at least that my programs have a name, an initializer method and a method that process an input and return some outputs
- what are some requirements from pseudo-terminal ??
  - Terminal requires to load "programs" (import js file)
  - A variable to set an active (running) program is required
  - When there is a running program, input needs to be passed to the program
  - Once the program has processed the input, it needs to return an output to the terminal

For the calculator I created a little pseudo code to understand how to process the arithmetic operations:

- Input is received
  - then split by space
      - if no spaces => it must be number or operator
      - else, every chunk must be a number or operator
- if number found => add to stack
- if operator found
  - if stack has at least 2 values => operate, add to stack
  - if stack does not have 2 values => show error, ignore input
  - if all input is processed => print result

- All numbers/operators has been processed
  - always show last element in stack
  - if stack is empty show "0"


## Testing

I created a few tests to prove the exercise is working as expected.
Tests are written in file `App.test.js`
In directory "/screenshots" there's an image with the result of the tests.
Tests were created using Jest and React Testing Library, so in order to run tests locally you just need to follow these steps:

1. Download project
2. Install dependencies using `npm install`
3. Run `npm test` to execute all tests

Available tests prove simple scenarios:

1. App shows welcome message
2. App shows input field
3. App is able to execute `./rpn` and loads RPN calculator program
4. Calculator is able to sum two numbers typing values one by one
5. Calculator is able to subtract two numbers typing expression all in one


## User manual
To execute the exercise visit the following link:

https://gcsebas99.github.io/rpn-ex/

Then you can follow instructions to execute "rpn program" or "skin program"

Available commands in terminal:

1. `?` - show help
2. `clear` - reset terminal
3. `ls` - show available programs
4. `./PROGRAM` - execute program

When you are running "rpn" you can also type

1. `reset` - set calculator back to 0 (empty calculator memory)
2. `exit` - quit program

And when you are running "skin" the available options are

1. `1` - select default skin
2. `2` - select optional skin
3. `exit` - quit program
