import React, { Component } from 'react'
import text from './example.js'
import { withStyles } from '@material-ui/core/styles'
import AvPlayArrow from '@material-ui/icons/PlayArrow'
import AvPause from '@material-ui/icons/Pause'
import Player from './Player'
import Editor from './Editor'
import debug from 'debug'

import {
  Drawer,
  AppBar,
  IconButton,
  SvgIcon,
  Toolbar,
  Typography,
  Button,
} from '@material-ui/core';

const log = debug('component:App')

const GithubLink = ({
  user,
  name,
  ...props,
}) =>
  <SvgIcon {...props}
    href={`https://github.com/${user}/${name}`}
    tooltip="Github"
    >
    <path d="M12.007 0C6.12 0 1.1 4.27.157 10.08c-.944 5.813 2.468 11.45 8.054 13.312.19.064.397.033.555-.084.16-.117.25-.304.244-.5v-2.042c-3.33.735-4.037-1.56-4.037-1.56-.22-.726-.694-1.35-1.334-1.756-1.096-.75.074-.735.074-.735.773.103 1.454.557 1.846 1.23.694 1.21 2.23 1.638 3.45.96.056-.61.327-1.178.766-1.605-2.67-.3-5.462-1.335-5.462-6.002-.02-1.193.42-2.35 1.23-3.226-.327-1.015-.27-2.116.166-3.09 0 0 1.006-.33 3.3 1.23 1.966-.538 4.04-.538 6.003 0 2.295-1.5 3.3-1.23 3.3-1.23.445 1.006.49 2.144.12 3.18.81.877 1.25 2.033 1.23 3.226 0 4.607-2.805 5.627-5.476 5.927.578.583.88 1.386.825 2.206v3.29c-.005.2.092.393.26.507.164.115.377.14.565.063 5.568-1.88 8.956-7.514 8.007-13.313C22.892 4.267 17.884.007 12.008 0z" />
  </SvgIcon>;

class App extends Component {

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
    log('toggle', this.state.playing)
    this.state.playing ?
      clearInterval(this.timer) :
      this.timer = setInterval(this.tick, 15000 / this.state.tempo);
    this.setState({ playing: !this.state.playing });
  }

  // Move the cursors along by one step.
  tick =() => {
    log('tick')
    
    const ranges = this.state.ranges.map(({ anchor: { ch, line }}) => {
      var next = text.split('\n')[line].slice(ch); // Character just after cursor
      var anchor = {
        ch: ch + 1,
        line,
      } // Set the anchor to be 1 to the right
      
      
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
      } // The head being 1 character behind makes it show up as a box
    });
    this.setState({ ranges })
    // this.setState({
    //   strings: instance.listSelections().map(({
    //     anchor: { line, ch },
    //     head,
    //   }) => instance.getLine(line).slice(0, ch)),
    //   ranges: instance.listSelections()
    // });
  };

  cursorActivity = instance => {
    log('cursorActivity', { instance })
    // this.setState({
    //   strings: instance.listSelections().map(({
    //     anchor: { line, ch },
    //     head,
    //   }) => instance.getLine(line).slice(0, ch)),
    //   ranges: instance.listSelections()
    // });
  }
  
  keyHandled = (instance, name, event) => {
    name === 'Right' ? this.right(instance, event) :
    name ==='Left' ? this.left(instance, event) :
    log('keyHandled', { name })
  }
  
  left = (instance, event) => {
    log('left', { instance, event })
    this.setState({
      strings: instance.listSelections().map(({
        anchor: { line, ch },
        head,
      }) => instance.getLine(line).slice(0, ch+1)),
      ranges: instance.listSelections()
    });
  }

  
  right = (instance, event) => {
    log('right', { instance, event })
    this.setState({
      strings: instance.listSelections().map(({
        anchor: { line, ch },
        head,
      }) => instance.getLine(line).slice(0, ch)),
      ranges: instance.listSelections()
    });
  }
  
  // Let's the App know what is happening to the text, not the other way around
  update = text => {
    log('update', { text })
    this.setState({ text });
  }

  moveCursors = (x, y) => {
    log('moveCursors', { x, y })
    this.setState({
      ranges: this.state.ranges.map(({
        anchor: { ch: a, line: b },
        head: { ch: c, line: d }
      }) => ({
        anchor: { ch: a + x, line: b + y},
        head: { ch: c + x, line: d + y},
      }))
    })
  }

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
    this.setState(({ ranges }) => ({ ranges }))
  }

  render = () => {
    const {
      jump,
      toggle,
      update,
      cursorActivity,
      keyHandled,
      state: {
        playing,
        open,
        ranges,
        strings,
        text,
      },
      props: { classes },
    } = this;

    return <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            tooltip={playing ? 'Stop' : 'Play'}
            onClick={toggle}
            >
            {playing ? <AvPause /> : <AvPlayArrow />}
          </IconButton>
          <Typography variant="title" color="inherit" className={classes.flex}>
            React Songs
          </Typography>
          <GithubLink
            target="_blank"
            user='ryanwhite04'
            name='react-songs'
          />
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        docked={false} open={open}
        onRequestChange={open => this.setState({ open })} >
      </Drawer>
      <Editor
        ace
        update={update}
        cursorActivity={cursorActivity}
        keyHandled={keyHandled}
        ranges={ranges}
        options={{
          lineNumbers: true,
          viewportMargin: Infinity,
          firstLineNumber: 0,
          fixedGutter: false,
        }}
        // className={classes.editor}
        // style={{
        //   width: "100%",
        //   display:
        // }}
        >
        {text}
      </Editor>
      {strings.map((string, key) => {
        // return <Player jump={jump(key)} key={key}>{string}</Player>
        return <Player key={key}>{string}</Player>
      })}
    </div>
  }
}

export default withStyles({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  editor: {
    width: "100%",
    flexGrow: 1,
    flex: 1,
  }
})(App)

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
