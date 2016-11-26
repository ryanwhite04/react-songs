import React from 'react';
import { Sequencer, Synth } from 'react-music';

const Stream = ({
  open = 60,
  type = 'sine',
  line = '1-4-3-5--7',
  resolution = 32,
  bars = 2,
  length = 2,
}) => <Sequencer resolution={resolution} bars={bars} >
  <Synth type="sine" steps={toSteps(line, length, toNote(open))} />
</Sequencer>


function toNote(open) {
  return number => [
    'c',
    'c#',
    'd',
    'd#',
    'e',
    'f',
    'f#',
    'g',
    'g#',
    'a',
    'a#',
    'b',
  ][(open + number) % 12] + Math.floor((open + number) / 12);
}

function toSteps(line, length, toNote) {
  var steps = line.split('').map((beat, i) => beat === '-' ? false : [
    i, length, toNote(Number(beat))
  ]).filter(Array);
  console.log('toSteps', {
    line, length, toNote, steps,
  })
  return steps;
}

export default Stream;
