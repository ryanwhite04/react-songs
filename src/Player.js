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

export default ({
  children,
  context,
  playing,
  text,
  ranges,
}) => {

  // var guitar = new Instrument(context, {
  //   capo: 6,
  //   gain: 0.5,
  //   type: 'sine',
  //   duration: 1,
  // }, {
  //   attack: 0.01,
  //   decay: 0.2,
  //   sustain: 0.2,
  //   release: 0.2
  // });
  //
  // console.log({ ranges })
  //
  // ranges
  //   .map(({ anchor: { line, ch }}) => text.split('\n')[line].slice(0, ch))
  //   .filter(text => text)
  //   .map(text => ({
  //     note: parseInt(text.slice(-1), 36),
  //     string: guitar.string(getNote(mappings[text.split('|')[0]]))
  //   }))
  //   .forEach(({ note, string }, i) => {
  //     if(!isNaN(note)) {
  //       console.log({
  //         note,
  //       })
  //       string.pluck(note, 0.5)
  //     }
  //   });
  // return null;

  ranges
    .map(({ anchor: { line, ch }}) => text.split('\n')[line].slice(0, ch))
    .filter(text => text)
    .map(text => ({
      note: parseInt(text.slice(-1), 36),
      string: getNote(mappings[text.split('|')[0]])
    }))
    .filter(({ note, string }) => !isNaN(note))
    .map(({ note, string }) => note + string - 20)
    .map(note => context
      .createMediaElementSource(children[note])
      .connect(context.destination)
    );
  return null;
};

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
