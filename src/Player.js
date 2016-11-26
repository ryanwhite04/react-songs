import React, { Component } from 'react';

import {
  Analyser,
  Song,
  Sequencer,
  Sampler,
  Synth,
} from 'react-music';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: true };
  }
  toggle = () => this.setState({ playing: !this.state.playing });
  render = () =>
    <Song playing={this.state.playing} tempo={90} >
      <Analyser onAudioProcess={this.handleAudioProcess}>
        {/* <Sequencer resolution={16} bars={1} >
          <Sampler sample="samples/kick.wav" steps={[0, 2, 8, 10]} />
          <Sampler sample="samples/snare.wav" steps={[4, 12]} />
        </Sequencer>
        <Sequencer resolution={16} bars={2} >
          <Synth
            type="sine"
            steps={[
              [0, 8, 'c2'],
              [8, 4, 'c2'],
              [12, 4, 'd#2'],
              [16, 8, 'f2'],
              [24, 8, 'f1'],
            ]}
          />
        </Sequencer> */}
      </Analyser>
    </Song>
}
