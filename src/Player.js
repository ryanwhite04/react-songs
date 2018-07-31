import React, { Component } from 'react'
import { Players } from 'tone'
import debug from 'debug'
import families from 'soundfonts/families'
import names from 'soundfonts/names'
import { homepage } from 'soundfonts/package'

const notes = { first: 21, last: 109 }
const formats = ['mp3', 'ogg']
const log = debug('component:Player')

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

function buffer(ogg) {
  return new Promise((resolve, reject) => new Players(ogg, resolve))
}

async function getInstrument(instrument = 24, ext = 'mp3') {

  const player = await fetch(`${process.env.PUBLIC_URL}/instruments/${names[instrument]}/${ext}.json`)
    .then(response => response.json())
    .then(buffer)
    .catch(err => log('getInstrument', { err }))

  log('getPlayer', player)
  return {
    name: names[24],
    notes,
    formats,
    family: families[~~(instrument / 16)],
    player: player.toMaster(),
  }
}

export default class Player extends Component {
  
  state = {
    ready: false,
  }
  
  play({ player, name, family, formats, notes }) {
    return note => {
      if (Number.isInteger(note) && note >= 0 && note < 88) {
        log('play', { note, instrument: {
          player,
          name,
          family,
          formats,
          notes,
        }});
        player.has(note) && player.get(note).start();
      }
      return note;
    }
  }

  async componentDidMount() {
    log('componentDidMount', this)
    const instrument = await getInstrument();
    
    this.setState({ instrument, ready: true });
  }
  
  render = () => {
    const {
      props: { children },
      state: { instrument, ready },
      play,
    } = this
    
    return <div><b><span>{ready ? play(instrument)(read(children)) : "Loading Instrument"}</span></b><span>{children}</span></div>
  }
}

function read(text) {
  let note = parseInt(text.slice(-1), 36);
  let string = getNote(mappings[text.split('|')[0]]);
  log('read', { text, note, string })
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

// function toNote(open) {
//   return number => [
//     'c', 'c#',
//     'd', 'd#',
//     'e',
//     'f', 'f#',
//     'g', 'g#',
//     'a', 'a#',
//     'b',
//   ][(open + number) % 12] + Math.floor((open + number) / 12);
// }


// function Instrument(context, {
//   capo = 0,
//   gain = 1,
//   type = 'sine',
//   duration = 1,
// }, envelope = {
//   attack: 0.01,
//   decay: 0.2,
//   sustain: 0.2,
//   release: 0.2
// }) {

//   return {
//     string: open => {

//       var amp, osc, env;

//       amp = context.createGain();
//       amp.connect(context.destination);

//       env = contour(context, envelope);
//       env.connect(amp.gain);

//       osc = context.createOscillator();
//       osc.type = type;
//       osc.connect(amp);

//       open *= Math.pow(2, capo / 12);
//       return {
//         pluck: (fret = 0, duration = 1) => {
//           var frequency = open * Math.pow(2, fret / 12);
//           var now = context.currentTime;
//           console.log({
//             frequency,
//             now,
//             fret,
//             duration,
//             osc, env, amp
//           })
//           amp.gain.setValueAtTime(gain, context.currentTime);
//           osc.frequency.setValueAtTime(frequency, context.currentTime);
//           env.start(context.currentTime);
//           osc.start(context.currentTime);
//           osc.stop(now + duration);
//           env.stop(now + duration);
//         },
//       }
//     },
//   };
// }