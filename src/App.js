import React, { Component } from 'react';
import text from './example.js';
import { MuiThemeProvider } from 'material-ui/styles';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Player from './Player';
import Editor from './Editor';
import soundfonts from 'soundfonts';
import guitar from 'soundfonts/instruments/Acoustic Guitar (nylon)/mp3.json';
// import ogg from 'soundfonts/instruments/Acoustic Guitar (nylon)/ogg.json';

import {
  Drawer,
  AppBar,
  IconButton,
} from 'material-ui';

injectTapEventPlugin();

const GithubLink = ({
  touch,
  target,
  iconStyle,
  user,
  name,
}) =>
  <IconButton { ...{ touch, target, iconStyle } }
    iconClassName="muidocs-icon-custom-github"
    href={'https://github.com/' + user + '/' + name}
    tooltip="Github"
    tooltipPosition="bottom-left"
  />;

class App extends Component {

  state = {
    open: false,
    playing: false,
    text: text,
    tempo: 120,
    context: new AudioContext(),
    ranges: [{
      anchor: { ch: 0, line: 0 },
      head: { ch: 0, line: 0 },
    }],
  };

  toggle = () => {
    this.state.playing ?
      clearInterval(this.timer) :
      this.timer = setInterval(this.tick, 15000 / this.state.tempo);
    this.setState({ playing: !this.state.playing });
  }

  tick =() => {
    var ranges = this.state.ranges.map(({ anchor: { ch, line }}) => {
      var next = text.split('\n')[line].slice(ch);
      var anchor = {
        ch: ch + 1,
        line,
      }
      if (next[0] === '|') {
        if (next[1] === '-') {
          anchor.ch += 4;
        } else if (!next[1]) {

          anchor.ch = text.split('\n')[line + 10].indexOf('|---') + 5;
          anchor.line += 10;
        }
      }
      return {
        anchor, head: {
          line: anchor.line,
          ch: anchor.ch - 1,
        },
      }
    });
    this.setState({ ranges })
  };

  cursorActivity = instance => this.setState({
    ranges: instance.listSelections()
  });

  update = text => this.setState({ text });

  moveCursors = (x, y) => this.setState({
    ranges: this.state.ranges.map(({
      anchor: { ch: a, line: b },
      head: { ch: c, line: d }
    }) => ({
      anchor: { ch: a + x, line: b + y},
      head: { ch: c + x, line: d + y},
    }))
  })

  setInstrument = name => {

    function handleJSON(json) {
      const getAudio = string => new Audio(string);
      const play = instrument => note => instrument[note].play();
      return play(json.map(getAudio));
    }

    fetch(process.env.PUBLIC_URL + '/instruments/' + name + '/mp3.json')
      .then(response => response.json())
      .then(handleJSON)
      .then(instrument => this.setState({ instrument }));
  }

  render = () =>
    <MuiThemeProvider>
      <div style={this.props.style}>
        <AppBar title="React Songs"
          iconElementRight={
            <GithubLink
              touch
              target="_blank"
              user='ryanwhite04'
              name='react-songs'
              iconStyle={{
                color: 'white',
              }}
            />
          }
          iconElementLeft={
            <IconButton
              touch
              tooltip={this.state.playing ? 'Stop' : 'Play'}
              tooltipPosition="bottom-right"
              >
              {this.state.playing ? <AvPause /> : <AvPlayArrow />}
            </IconButton>
          }
          onLeftIconButtonTouchTap={this.toggle}
          zDepth={2}
        />
        <Drawer
          docked={false} open={this.state.open}
          onRequestChange={open => this.setState({open})} >
        </Drawer>
        <Editor
          implementation='ace editor'
          update={this.update}
          cursorActivity={this.cursorActivity}
          ranges={this.state.ranges}
          options={{
            lineNumbers: true,
            viewportMargin: Infinity,
            firstLineNumber: 0,
            fixedGutter: false,
          }}
          >
          {this.state.text}
        </Editor>
        <Player
          playing={this.state.playing}
          context={this.state.context}
          ranges={this.state.ranges}
          text={this.state.text}
        >
          {/* {guitar.map((src, i) => <audio
            key={i}
            crossOrigin="anonymous"
            src={src} >
          </audio>)} */}

          {guitar.map((src, i) => {
            var audio = new Audio(src);
            audio.crossOrigin = 'anonymous';
            return audio;
          })}
        </Player>
      </div>
    </MuiThemeProvider>
}

export default App;
