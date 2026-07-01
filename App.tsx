/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Minus, Plus, X, Divide, Equal, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [value, setValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForNext, setWaitingForNext] = useState<boolean>(false);

  const inputDigit = (digit: string) => {
    if (waitingForNext) {
      setValue(digit);
      setWaitingForNext(false);
    } else {
      setValue(value === '0' ? digit : value + digit);
    }
  };

  const inputDot = () => {
    if (waitingForNext) {
      setValue('0.');
      setWaitingForNext(false);
    } else if (value.indexOf('.') === -1) {
      setValue(value + '.');
    }
  };

  const clearAll = () => {
    setValue('0');
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNext(false);
  };

  const toggleSign = () => {
    setValue(String(parseFloat(value) * -1));
  };

  const inputPercent = () => {
    const currentValue = parseFloat(value);
    if (currentValue === 0) return;
    setValue(String(currentValue / 100));
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(value);

    if (previousValue == null) {
      setPreviousValue(value);
    } else if (operator) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operator);
      setValue(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForNext(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, next: number, op: string) => {
    switch (op) {
      case '+': return prev + next;
      case '-': return prev - next;
      case '*': return prev * next;
      case '/': return prev / next;
      default: return next;
    }
  };

  const handleEqual = () => {
    if (!operator || previousValue == null) return;
    const inputValue = parseFloat(value);
    const newValue = calculate(parseFloat(previousValue), inputValue, operator);
    setValue(String(newValue));
    setPreviousValue(null);
    setOperator(null);
    setWaitingForNext(true);
  };

  const Button = ({ children, onClick, className = '' }: any) => {
    return (
      <motion.button 
        whileTap={{ scale: 0.9, backgroundColor: "rgba(0,0,0,0.05)" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onClick={onClick} 
        className={`flex items-center justify-center transition-colors duration-100 cursor-pointer ${className}`}
      >
        {children}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-slate-900 font-sans">
      <motion.h1 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl font-bold tracking-tight text-slate-800 mb-8"
      >
        Suryanshu's calculator
      </motion.h1>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-[420px] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        
        {/* Display Screen */}
        <div className="bg-white p-8 border-b border-slate-100">
          <div className="text-right text-slate-400 text-sm font-mono h-6 mb-1">
            <AnimatePresence mode="wait">
              <motion.span
                key={`${previousValue}-${operator}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="inline-block"
              >
                {previousValue} {operator === '*' ? '×' : operator === '/' ? '÷' : operator}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="text-right text-6xl font-light text-slate-900 tracking-tighter truncate overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="inline-block"
              >
                {value}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-4">
          {/* Row 1 */}
          <Button 
            className="h-20 border-r border-b border-slate-100 text-red-500 font-semibold text-lg hover:bg-red-50"
            onClick={clearAll}
          >
            {value === '0' && previousValue === null ? 'AC' : 'C'}
          </Button>
          <Button 
            className="h-20 border-r border-b border-slate-100 text-slate-600 font-semibold text-lg hover:bg-slate-50"
            onClick={toggleSign}
          >
            ±
          </Button>
          <Button 
            className="h-20 border-r border-b border-slate-100 text-slate-600 font-semibold text-lg hover:bg-slate-50"
            onClick={inputPercent}
          >
            %
          </Button>
          <Button 
            className={`h-20 border-b border-slate-100 bg-slate-50 text-blue-600 font-bold text-2xl hover:bg-slate-100 ${operator === '/' ? 'bg-blue-100' : ''}`}
            onClick={() => performOperation('/')}
          >
            <Divide size={28} />
          </Button>

          {/* Row 2 */}
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('7')}>7</Button>
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('8')}>8</Button>
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('9')}>9</Button>
          <Button className={`h-20 border-b border-slate-100 bg-slate-50 text-blue-600 font-bold text-2xl hover:bg-slate-100 ${operator === '*' ? 'bg-blue-100' : ''}`} onClick={() => performOperation('*')}><X size={28} /></Button>

          {/* Row 3 */}
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('4')}>4</Button>
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('5')}>5</Button>
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('6')}>6</Button>
          <Button className={`h-20 border-b border-slate-100 bg-slate-50 text-blue-600 font-bold text-2xl hover:bg-slate-100 ${operator === '-' ? 'bg-blue-100' : ''}`} onClick={() => performOperation('-')}><Minus size={28} /></Button>

          {/* Row 4 */}
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('1')}>1</Button>
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('2')}>2</Button>
          <Button className="h-20 border-r border-b border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={() => inputDigit('3')}>3</Button>
          <Button className={`h-20 border-b border-slate-100 bg-slate-50 text-blue-600 font-bold text-2xl hover:bg-slate-100 ${operator === '+' ? 'bg-blue-100' : ''}`} onClick={() => performOperation('+')}><Plus size={28} /></Button>

          {/* Row 5 */}
          <Button className="col-span-2 h-20 border-r border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50 !justify-start px-12" onClick={() => inputDigit('0')}>0</Button>
          <Button className="h-20 border-r border-slate-100 text-slate-800 font-medium text-xl hover:bg-slate-50" onClick={inputDot}>.</Button>
          <Button className="h-20 bg-blue-600 text-white font-bold text-2xl hover:bg-blue-700" onClick={handleEqual}><Equal size={28} /></Button>
        </div>
      </motion.div>
    </div>
  );
}
