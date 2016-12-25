import React from 'react';
import parser from 'note-parser';
import contour from 'audio-contour';

const Synth = ({
  type = 'sine', // sine, square, sawtooth, triangle
  note = 50,
  time = 1,
  gain = 1,
  glide = 1,
  duration = 1,
  transpose = 0,
  context,
  envelope = {
    attack: 0.01,
    decay: 0.2,
    sustain: 0.2,
    release: 0.2
  },
}) => {

  console.log('Synth')
  var amplitudeGain = context.createGain();
  amplitudeGain.gain.value = gain;
  amplitudeGain.connect(context.destination);

  var osc = context.createOscillator();
  osc.type = type;
  osc.connect(amplitudeGain);


  note = note.slice(0, -1) + (parseInt(note[note.length - 1], 0) + parseInt(transpose, 0))

  var freq = parser.freq(note);

  const env = contour(context, envelope);

  env.connect(amplitudeGain);

  osc.frequency.setTargetAtTime(freq, time, glide || 0.001);

  env.start(time);
  env.stop(context.currentTime + duration);

  console.log(freq, time)

  return <div></div>
}

export default Synth;
