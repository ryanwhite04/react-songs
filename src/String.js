import React from 'react';
import Synth from './Synth';

let toNote = open => number => [
    'c', 'c#',
    'd', 'd#',
    'e',
    'f', 'f#',
    'g', 'g#',
    'a', 'a#',
    'b',
  ][(open + number) % 12] + Math.floor((open + number) / 12);

let toSteps = (line, length, toNote) =>
  line.trim().split('').map((beat, i) => /[0-9A-Z]/.test(beat) ? [
    i, length, toNote(parseInt(beat, 36))
  ] : false).filter(Array);

const String = ({
  text,
  char,
  type = 'sine',
  open = 60,
  bars = 2,
  length = 2,
  resolution = 32,
  callback = args => console.log(args),
}) => {
  return <Synth {...{type}} />
}

export default String;
