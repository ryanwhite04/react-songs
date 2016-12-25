import React, { Component } from 'react';
import text from './example.js';
import { MuiThemeProvider } from 'material-ui/styles';
import {
  Drawer,
  AppBar,
  IconButton,
} from 'material-ui';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Player from './Player';
import Editor from './Editor';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
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
      // console.log({
      //   next,
      //   ch, line,
      // })
      return {
        anchor, head: {
          line: anchor.line,
          ch: anchor.ch - 1,
        },
      }
    });
    this.setState({ ranges })
  };

  cursorActivity = instance => {
    var ranges = instance.listSelections();

    // console.log('app', 'cursorActivity', { ranges: ranges[0] });
    this.setState({ ranges });
  }

  update = text => {
    // console.log(text);
    this.setState({ text });
  }

  moveCursors = (x, y) => this.setState({
    ranges: this.state.ranges.map(({
      anchor: { ch: a, line: b },
      head: { ch: c, line: d }
    }) => ({
      anchor: { ch: a + x, line: b + y},
      head: { ch: c + x, line: d + y},
    }))
  })

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
        />
      </div>
    </MuiThemeProvider>
}

export default App;
