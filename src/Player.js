import contour from 'audio-contour';

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
};

const Player = ({
  context,
  playing,
  text,
  ranges,
}) => {
  var guitar = new Instrument(context, {
    capo: 6,
    gain: 0.5,
    type: 'sine',
    duration: 0.5,
  }, {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.2,
    release: 0.2
  });

  ranges
    .map(({ anchor: { line, ch }}) => text.split('\n')[line].slice(0, ch))
    .filter(text => text)
    .map(text => ({
      note: parseInt(text.slice(-1), 36),
      string: guitar.string(getNote(mappings[text.split('|')[0]]))
    }))
    .forEach(({ note, string }) => {
      console.log(note);
      isNaN(note) || string.pluck(note, 0.5)
    });
  return null;
};

function getNote(string = '') {
  var trimmed = string.trim();
  var octave = Number(trimmed.slice(-1));
  var note = trimmed.slice(1, -1);
  return 440 * 2 ** (([
    'C', 'C#',
    'D', 'D#',
    'E',
    'F', 'F#',
    'G', 'G#',
    'A', 'A#',
    'B'
  ].indexOf(note) + 12 * octave - 58) / 12);
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
          amp.gain.setValueAtTime(gain, now);
          osc.frequency.setValueAtTime(frequency, now);
          env.start(now + 0.05);
          osc.start(now);
          osc.stop(now + duration);
          env.stop(now + duration);
        },
      }
    },
  };
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

// function createOscillator(time: number, note: string, duration: number) {
//   const amplitudeGain = this.context.audioContext.createGain();
//   amplitudeGain.gain.value = 0;
//   amplitudeGain.connect(this.connectNode);
//
//   const env = contour(this.context.audioContext, {
//     attack: this.props.envelope.attack,
//     decay: this.props.envelope.decay,
//     sustain: this.props.envelope.sustain,
//     release: this.props.envelope.release,
//   });
//
//   env.connect(amplitudeGain.gain);
//
//   const osc = this.context.audioContext.createOscillator();
//   const transposed = note.slice(0, -1) +
//     (parseInt(note[note.length - 1], 0) + parseInt(this.props.transpose, 0));
//
//   osc.frequency.value = parser.freq(transposed);
//   osc.type = this.props.type;
//   osc.connect(amplitudeGain);
//
//   if (this.props.busses) {
//     const master = this.context.getMaster();
//     this.props.busses.forEach((bus) => {
//       if (master.busses[bus]) {
//         osc.connect(master.busses[bus]);
//       }
//     });
//   }
//
//   osc.start(time);
//   env.start(time);
//
//   const finish = env.stop(this.context.audioContext.currentTime + duration);
//   osc.stop(finish);
// }

export default Player;
