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
        <Sequencer resolution={16} bars={2} >
          <Synth
            type="sine"
            steps={[
              [0, 8, 'c4'],
              [8, 4, 'c4'],
              [12, 4, 'd#4'],
              [16, 8, 'f4'],
              [24, 8, 'f4'],
            ]}
          />
        </Sequencer>
      </Analyser>
    </Song>
}
