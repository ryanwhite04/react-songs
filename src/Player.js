import React, { Component } from 'react'
import contour from 'audio-contour';
import soundfonts from 'soundfonts';
import ogg from 'soundfonts/instruments/Acoustic Guitar (nylon)/ogg.json';
import { Players, Synth } from 'tone';

const player = new Players(ogg);

const guitar = {
  ...soundfonts.instruments[24],
  player: player.toMaster(),
}

const mappings = {
  '_': '|',
  '^': '|L10|R',
  '$': '|M10|S',
  'e': '|E6 ',
  'B': '|B5 ',
  'G': '|G5 ',
  'D': '|D5 ',
  'A': '|A4 ',
  'E': '|E4 ',
}

console.log('Player', player, guitar, mappings)


function play(note) {
  console.log('play', note);

  guitar.player.has(note) && guitar.player.get(note).start();
  return note;
}

export default class Player extends Component {

  state = {
    playing: false,
  }

  render = () => {
    const {
      props: { children },
      state: { playing }
    } = this

    
    return <div>{play(read(children))}</div>
  }
};

function read(text) {
  let note = parseInt(text.slice(-1), 36);
  let string = getNote(mappings[text.split('|')[0]]);
  console.log('read', { text, note, string })
  return isNaN(note) ? null : note + string - 38;
}

function getNote(string = '') {
  var trimmed = string.trim();
  var octave = Number(trimmed.slice(-1));
  var note = trimmed.slice(1, -1);
  return ([
    'C', 'C#',
    'D', 'D#',
    'E',
    'F', 'F#',
    'G', 'G#',
    'A', 'A#',
    'B'
  ].indexOf(note) + 12 * octave);
}

function toNote(open) {
  return number => [
    'c', 'c#',
    'd', 'd#',
    'e',
    'f', 'f#',
    'g', 'g#',
    'a', 'a#',
    'b',
  ][(open + number) % 12] + Math.floor((open + number) / 12);
}


function Instrument(context, {
  capo = 0,
  gain = 1,
  type = 'sine',
  duration = 1,
}, envelope = {
  attack: 0.01,
  decay: 0.2,
  sustain: 0.2,
  release: 0.2
}) {

  return {
    string: open => {

      var amp, osc, env;

      amp = context.createGain();
      amp.connect(context.destination);

      env = contour(context, envelope);
      env.connect(amp.gain);

      osc = context.createOscillator();
      osc.type = type;
      osc.connect(amp);

      open *= Math.pow(2, capo / 12);
      return {
        pluck: (fret = 0, duration = 1) => {
          var frequency = open * Math.pow(2, fret / 12);
          var now = context.currentTime;
          console.log({
            frequency,
            now,
            fret,
            duration,
            osc, env, amp
          })
          amp.gain.setValueAtTime(gain, context.currentTime);
          osc.frequency.setValueAtTime(frequency, context.currentTime);
          env.start(context.currentTime);
          osc.start(context.currentTime);
          osc.stop(now + duration);
          env.stop(now + duration);
        },
      }
    },
  };
}