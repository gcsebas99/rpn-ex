import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from './App';

const setup = () => {
  act(() => { render(<App testingMode />) });
  const input = document.querySelector('.input-line');
  return { input };
};

const typeText = (field, value) => {
  fireEvent.change(field, {target: {value: value}});
  fireEvent.keyUp(field, {key: 'Enter', code: '13'});
};

const getLastResult = () => {
  const ps = document.querySelectorAll('p');
  return ps[ps.length- 2];
};

test('renders welcome message', () => {
  const {input} = setup();
  const welcomeMessage = screen.getByText(/Welcome to SnapTerminal/i, { exact: false });
  expect(welcomeMessage).toBeInTheDocument();
});

test('renders terminal input', () => {
  const {input} = setup();
  expect(input.type).toBe('text');
});

test('runs RPN program', () => {
  const {input} = setup();
  fireEvent.change(input, {target: {value: './rpn'}});
  expect(input.value).toBe('./rpn');
  fireEvent.keyUp(input, {key: 'Enter', code: '13'});
  const welcomeMessage = screen.getByText(/Welcome to RPN Calculator/i, { exact: false });
  expect(welcomeMessage).toBeInTheDocument();
  expect(input.value).toBe('');
});

test('runs RPN program and sums two numbers (one-by-one)', () => {
  const {input} = setup();
  typeText(input, './rpn');
  typeText(input, '5');
  typeText(input, '9');
  typeText(input, '+');
  const lastResult = getLastResult();
  expect(lastResult.textContent).toBe('14');
});

test('runs RPN program and subtracts two numbers (all-in-one)', () => {
  const {input} = setup();
  typeText(input, './rpn');
  typeText(input, '8 17 -');
  const lastResult = getLastResult();
  expect(lastResult.textContent).toBe('-9');
});

