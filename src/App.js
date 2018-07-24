import React, { Component } from 'react';
import text from './example.js';
import { MuiThemeProvider } from 'material-ui/styles';
import AvPlayArrow from 'material-ui/svg-icons/av/play-arrow';
import AvPause from 'material-ui/svg-icons/av/pause';
import Player from './Player';
import Editor from './Editor';

import {
  Drawer,
  AppBar,
  IconButton,
} from 'material-ui';

const GithubLink = ({
  touch,
  target,
  iconStyle,
  user,
  name,
}) =>
  <IconButton { ...{ touch, target, iconStyle } }
    iconClassName="muidocs-icon-custom-github"
    href={`https://github.com/${user}/${name}`}
    tooltip="Github"
    tooltipPosition="bottom-left"
  />;

export default class App extends Component {

  state = {
    open: false,
    playing: false,
    text: text,
    tempo: 120,
    strings: [],
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

  // Move the cursors along by one step.
  tick =() => {
    var ranges = this.state.ranges.map(({ anchor: { ch, line }}) => {
      var next = text.split('\n')[line].slice(ch);
      var anchor = {
        ch: ch + 1,
        line,
      }
      // if (next[0] === '|') {
      //   if (next[1] === '-') {
      //     anchor.ch += 4;
      //   } else if (!next[1]) {

      //     anchor.ch = text.split('\n')[line + 10].indexOf('|---') + 5;
      //     anchor.line += 10;
      //   }
      // }
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
    console.log('cursorActivity', { instance })
    this.setState({
      strings: instance.listSelections().map(({
        anchor: { line, ch },
        head,
      }) => instance.getLine(line).slice(0, ch)),
      ranges: instance.listSelections()
    });
  }

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

  skip = key => () => {
    var ranges = this.state.ranges.map(({ anchor: { ch, line }}) => {
      var next = text.split('\n')[line].slice(ch);
      var anchor = {
        ch: ch + 1,
        line,
      }
      // if (next[0] === '|') {
      //   if (next[1] === '-') {
      //     anchor.ch += 4;
      //   } else if (!next[1]) {

      //     anchor.ch = text.split('\n')[line + 10].indexOf('|---') + 5;
      //     anchor.line += 10;
      //   }
      // }
      return {
        anchor, head: {
          line: anchor.line,
          ch: anchor.ch - 1,
        },
      }
    });
    this.setState(({ ranges }) => ({ ranges:  }))
  }

  render = () => {
    const {
      jump,
      toggle,
      update,
      cursorActivity,
      state: {
        playing,
        open,
        ranges,
        strings,
        text,
      },
      props: {
        style,
      },
    } = this;

    const options = {
      lineNumbers: true,
      viewportMargin: Infinity,
      firstLineNumber: 0,
      fixedGutter: false,
    }

    const iconElementRight = <GithubLink
      touch
      target="_blank"
      user='ryanwhite04'
      name='react-songs'
      iconStyle={{
        color: 'white',
      }}
    />

    const iconElementLeft = <IconButton
      touch
      tooltip={playing ? 'Stop' : 'Play'}
      tooltipPosition="bottom-right"
      >
      {playing ? <AvPause /> : <AvPlayArrow />}
    </IconButton>
  
    return <MuiThemeProvider>
      <div style={style}>
        <AppBar title="React Songs"

          iconElementRight={iconElementRight}
          iconElementLeft={iconElementLeft}
          onLeftIconButtonClick={toggle}
          zDepth={2}
        />
        <Drawer
          docked={false} open={open}
          onRequestChange={open => this.setState({ open })} >
        </Drawer>
        <Editor
          implementation='ace editor'
          update={update}
          cursorActivity={cursorActivity}
          ranges={ranges}
          options={options}
          >
          {text}
        </Editor>
        {strings.map((string, key) => <Player jump={jump(key)} key={key}>{string}</Player>)}
      </div>
    </MuiThemeProvider>
  }
}

// let Player = <Player
//   playing={playing}
//   context={context}
//   ranges={ranges}
//   text={text}
//   >
//   {/* {guitar.map((src, i) => <audio
//     key={i}
//     crossOrigin="anonymous"
//     src={src} >
//   </audio>)} */}

//   {guitar.map((src, i) => {
//     var audio = new Audio(src);
//     audio.crossOrigin = 'anonymous';
//     return audio;
//   })}
// </Player>
