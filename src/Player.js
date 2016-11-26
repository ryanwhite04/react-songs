import React, { Component } from 'react';

import {
  Analyser,
  Song,
} from 'react-music';

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = { playing: false };
  }
  toggle = () => this.setState({ playing: !this.state.playing });
  render = () =>
    <Song playing={this.state.playing} tempo={90} >
      <Analyser onAudioProcess={this.handleAudioProcess}>{this.props.children}</Analyser>
    </Song>
}
