import { useState, useEffect, useRef } from 'react';
import { timeout, scrollToBottom } from './utils/utils';
import './App.scss';
//programs
import RPN from './programs/rpn';
import Skin from './programs/skin';

const TERMINAL_INPUT_LINE = 'snapterminal:~#';
const TERMINAL_INPUT_LINE_PROGRAM = 'snapterminal[PRNM]:~#';
const TERMINAL_WELCOME = [
  '-BR-',
  "-PRE- ____                      _____                       _                _ ",
  "-PRE-/ ___|  _ __    __ _  _ __|_   _|___  _ __  _ __ ___  (_) _ __    __ _ | |",
  "-PRE-\\___ \\ | '_ \\  / _` || '_ \\ | | / _ \\| '__|| '_ ` _ \\ | || '_ \\  / _` || |",
  "-PRE- ___) || | | || (_| || |_) || ||  __/| |   | | | | | || || | | || (_| || |",
  "-PRE-|____/ |_| |_| \\__,_|| .__/ |_| \\___||_|   |_| |_| |_||_||_| |_| \\__,_||_|",
  "-PRE-                     |_|                                                  ",
  '-BR-',
  'Welcome to SnapTerminal!! (v.1.0.0)',
  '(A powerful terminal to run a RPN calculator exercise)',
  '-BR-',
  'You can type \'?\' to get a full list of available commands.',
  'Credits: Sebastián Gamboa (https://www.linkedin.com/in/sebastiangc/)',
  '-BR-',
];
const TERMINAL_HELP = [
  '-BR-',
  'You can use one of the following commands:',
  '? - show help',
  'clear - reset terminal',
  'ls - list applications in current directory',
  './[APP_NAME] - execute a program',
  '-BR-',
  'For more information, please contact SnapTerminal creator :-)',
  '-BR-',
];
const PROGRAMS = ['rpn', 'skin'];
const PROGRAMS_EXE = [RPN, Skin];
const PROGRAMS_DESCRIPTION = [
  'RPN Calculator', 
  'Run this program to change SnapTerminal skin',
];
const SYSTEM_SKINS = ['default', 'retro-gaming'];

// set focus hook 
const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => {htmlElRef.current &&  htmlElRef.current.focus()}
  return [ htmlElRef, setFocus ];
}

/**
 * App simulates unix terminal
 */
const App = ({ testingMode = false }) => {
  const [outputBuffer, setOutputBuffer] = useState([]); //terminal output
  const [outputBufferEnabled, setOutputBufferEnabled] = useState(false); //enables input field
  const [inputRef, setInputFocus] = useFocus(); //input field

  let flushBuffer = []; //content to be added to output on every I/O cycle

  const [runningProgram, setRunningProgram] = useState(null);
  const [systemSkin, setSystemSkin] = useState(SYSTEM_SKINS[0]);

  useEffect( () => {
    //Mount
    loadingRoutine();
  }, []); // eslint-disable-line

  /**
   * Fake loading routine
   */
  const loadingRoutine = async () => {
    //fake loading
    if(!testingMode) {
      await fakeLoading();
    }
    printTerminalMessage();
    //enable input
    setOutputBufferEnabled(true);
  };  

  const fakeLoading = async () => {
    const message = ['Loading.', 'Loading..', 'Loading...'];
    await replaceInBufferWithDelays(message, 500, 2);
    setOutputBuffer([...outputBuffer, 'Loading...']);
  };

  const printTerminalMessage = () => {
    setOutputBuffer([
      ...outputBuffer, 
      ...TERMINAL_WELCOME,
    ]);
  };

  const replaceInBufferWithDelays = async (replace, delay, repeat = 1) => {
    setOutputBufferEnabled(false);
    const origBuffer = [...outputBuffer];
    for(let i = 0; i < repeat; i++) {
      for await (const line of replace) {
        setOutputBuffer([...origBuffer, line]);
        await timeout(delay);
      }
    }
    await timeout(300);
    setOutputBufferEnabled(true);
  };

  /**
   * Output buffer functions
   */
  const appendToOutputBuffer = content => {
    if (Array.isArray(content)) {
      setOutputBuffer([
        ...outputBuffer,
        ...content,
      ]);
    } else if (typeof content === 'string') {
      setOutputBuffer([
        ...outputBuffer,
        content,
      ]);
    }
  };

  const flush = (content, isClear = false) => {
    inputRef.current.value = '';
    if(!isClear) {
      appendToOutputBuffer(content);
    } else {
      setOutputBuffer(TERMINAL_WELCOME);
    }
    if(!testingMode) {
      scrollToBottom(document.getElementsByClassName('terminal-view')[0]);
    }
  };

  /**
   * Input handling
   */
  const handleKeyUp = event => {
    if (event.key === 'Enter') {
      if(runningProgram) {
        let [result, flags] = runningProgram.processInput(event.target.value);
        processInputWithProgram(event.target.value, result, flags);
      } else {
        processInput(event.target.value);
      }
    }
  };

  const processInputWithProgram = (text, programResult, flags) => {
    flushBuffer = [terminalInputLine() + ' ' + text];
    if (Array.isArray(programResult)) {
      flushBuffer.push(...programResult);
    } else if (typeof programResult === 'string') {
      flushBuffer.push(programResult);
    }
    //handle flags
    if(flags.indexOf('HALT') >= 0){
      setRunningProgram(null);
    }
    if(flags.indexOf('SKIN') >= 0){
      const skinIndex = parseInt(flags.split('=')[1]);
      setSystemSkin(SYSTEM_SKINS[skinIndex]);
    }
    //flush
    flush(flushBuffer);
  };

  const processInput = async text => {
    let isClear = false;
    flushBuffer = [terminalInputLine() + ' ' + text];
    const trimmedText = text.trim();
    switch (trimmedText) {
      case '?':
        flushBuffer.push(...TERMINAL_HELP);
        break;
      case 'ls':
        flushBuffer.push(...listPrograms());
        break;
      case 'clear':
        flushBuffer = [terminalInputLine()];
        isClear = true;
        break;
      default:
        if(trimmedText.startsWith('./')) {
          //TODO: attempt running program
          const [success, program] = attemptRunProgram(trimmedText.substring(2));
          if(success) {
            let startedProgram = program();
            let initResult = startedProgram.init();
            flushBuffer.push(...initResult);
            setRunningProgram(startedProgram);
          } else {
            flushBuffer.push('Program: "' + trimmedText.substring(2) + '" does not exist. Use "ls" to see available programs.');
          }
        } else if(trimmedText.length > 0) {
          //unknown
          flushBuffer.push('Command: "' + trimmedText + '" not found.');
        }
        break;
    }
    flush(flushBuffer, isClear);
  };

  /**
   * Terminal commands
   */
  const listPrograms = () => {
    return PROGRAMS.map((program, index) => {
      return '-PRE-' + program + ' '.repeat(15 - program.length) + PROGRAMS_DESCRIPTION[index];
    });
  };

  const attemptRunProgram = program => {
    const index = PROGRAMS.indexOf(program);
    if (index >= 0) {
      return [true, PROGRAMS_EXE[index]];
    } else {
      return [false, 'unknown'];
    }
  };

  /**
   * Render elements
   */
  const terminalInputLine = () => {
    if(runningProgram) {
      return TERMINAL_INPUT_LINE_PROGRAM.replace('PRNM', runningProgram.displayName);
    } else {
      return TERMINAL_INPUT_LINE;
    }
  };

  const renderOutputBuffer = () => {
    let lineNumber = 0;
    return outputBuffer.map(line => {
      if (!line.startsWith('-BR-') && !line.startsWith('-PRE-')) {
        return (<p key={`l${lineNumber++}`}>{line}</p>);
      } else {
        if(line.startsWith('-PRE-')) {
          return (<pre key={`l${lineNumber++}`}>{line.substring(5)}</pre>);
        } else {
          return (<br key={`l${lineNumber++}`} />);
        }
      }
    });
  };

  const renderInputLine = () => {
    return outputBufferEnabled && (
      <p className="input-line-holder">
        <span>{terminalInputLine()}</span>
        <input 
          type="text"
          className="input-line"
          autoFocus
          ref={inputRef}
          onBlur={setInputFocus}
          onKeyUp={handleKeyUp}
        />
      </p>
    );
  };

  return (
    <div className={`app ${systemSkin}`}>
      <div className="terminal-view">
        {renderOutputBuffer()}
        {renderInputLine()}
        <div className="bottom-scroll"></div>
      </div>
    </div>
  );
};

export default App;
