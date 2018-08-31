import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import text from './example.js'
import AceEditor from 'react-ace'
// import brace from 'brace'
// import 'brace/mode/text'
import 'brace/theme/github'
import debug from 'debug'
import { Players } from 'tone'
import families from 'soundfonts/families'
import names from 'soundfonts/names'
import { homepage } from 'soundfonts/package'

const log = debug('component:App')
      
class App extends Component {

  state = {
    playing: false,
    text,
    tempo: 240,
    instruments: new Array(128).fill(false),
  }
  
  toggle = () => {
    log('toggle', this.state.playing)
    this.state.playing ?
      clearInterval(this.timer) :
      this.timer = setInterval(() => this.editor.execCommand('gotolineend'), 15000 / this.state.tempo);
    this.setState({ playing: !this.state.playing });
  }

  async loadInstrument(id = 24, ext = 'mp3') {
  
    function buffer(ogg) {
      return new Promise((resolve, reject) => new Players(ogg, resolve))
    }
  
    const player = (await fetch(`${process.env.PUBLIC_URL}/instruments/${names[id]}/${ext}.json`)
      .then(response => response.json())
      .then(buffer)
      .catch(console.error)).toMaster()
  
    return {
      name: names[id],
      notes: { first: 21, last: 109 },
      formats: ['mp3', 'ogg'],
      family: families[~~(id / 16)],
      play: note => player.has(note) && player.get(note).start(),
    }
  }

  update = text => {
    log('update', { text })
    this.setState({ text });
  }
  
  gotolinestart = app => function (editor, { count, ...args }) {
    debugger
    let { state: { instrument, text }} = app;
    const { row, column } = editor.getCursorPosition();
    const line = text.split('\n')[row]
    const note = read(line.slice(0, column))
    const next = line.slice(column - 4, column )
      // .split('').reverse().join('')
    log(next)
    if (/\|---/.test(next)) {
      editor.navigateLeft(4);
      log('Skip', `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else if (!column) {
      editor.navigateUp(10)
      editor.navigateLineEnd()
      
      log('New', `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else {
      note && instrument && instrument.play(note)
      editor.navigateLeft(args.times)
      log('Play', `${next}: ${row}, ${column}`)
    }
  }
  
  gotolineend = app => function (editor, { count, ...args }) {
    let { state: { instrument, text }} = app;
    const { row, column } = editor.getCursorPosition();
    const line = text.split('\n')[row]
    const note = read(line.slice(0, 1+column))
    const next = line.slice(column, column + 4)
    if (/\|---/.test(next)) {
      editor.navigateRight(4);
      log('Skip', `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else if (/\|L\d\d/.test(next)) {
      let col = next.slice(2);
      editor.navigateTo(parseInt(next.slice(2)), 0)
      log(`Jump to ${col}`, `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else if (/^\|\s*$/.test(next)) {
      editor.navigateDown(10)
      editor.navigateLineStart()
      log('Last', `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else if (/^\|\|\s*$/.test(next)) {
      // editor.navigateDown(10)
      editor.navigateLineStart()
      log('Last', `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else if (/^\*\|\s*$/.test(next)) {
      // editor.navigateDown(10)
      debugger;
      editor.navigateLineStart()
      log('Last', `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else if (!column && /\|?[A-Ga-g]?#?\d?\|/.test(next)) {
      editor.navigateRight(next.split('|')[0].length)
      log('New', `${next}: ${row}, ${column}`)
      this.exec(editor, { ...args, count: ++count });
    } else {
      note && instrument && instrument.play(note)
      editor.navigateRight(args.times)
      log('Play', `${next}: ${row}, ${column}`)
    }
  }
  
  download = app => {
    return function(editor, args) {
      log('download')
      return ({ target }) => {
        target.setAttribute('href', `data:application/txt,${encodeURIComponent(editor.getValue())}`)
        target.setAttribute('download', `${document.getElementById('filename').value}.txt`)
      }
    }
  }
  
  upload = app => {
    return function(editor, args) {
      log('upload')
    }
  }

  componentDidMount = () => {
    
    const {
      editor,
      gotolinestart,
      gotolineend,
      toggle,
      loadInstrument,
      download,
      upload,
    } = this;
    
    loadInstrument().then(instrument => {
      this.setState({ instrument })
    })
    const commands = {
      toggle: {
        exec: toggle,
        bindKey: { win: 'Alt-Space', mac: 'Alt-Space' },
      },
      download: {
        exec: download(this),
        bindKey: { win: 'Ctrl-S', mac: 'Ctrl-S' },
      },
      upload: {
        exec: upload(this),
        bindKey: { win: 'Ctrl-O', mac: 'Ctrl-O' },
      },
      gotolinestart: {
        exec: gotolinestart(this),
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
      },
      gotolineend: {
        exec: gotolineend(this),
        multiSelectAction: "forEach",
        scrollIntoView: "cursor",
        readOnly: true
      }
    }
    
    Object.entries(commands).map(([name, command]) => {
      editor.commands.addCommand({
        ...(editor.commands.commands[name] || { name }),
        ...command,
      })
    })
    
    // Tell ace that the alt key is held down for mousedown events
    // This makes it so blockselection is always on
    // It also allows block selection on chromebooks
    editor._eventRegistry.mousedown[1] = (func => e => func({
      ...e, ...e.__proto__,
      getButton: () => e.getButton(),
      domEvent: { ...e.domEvent,
        altKey: !e.domEvent.altKey,
        shiftKey: e.domEvent.shiftKey,
        ctrlKey: e.domEvent.ctrlKey,
      },
    }))(editor._eventRegistry.mousedown[1])
    
    let options = {
      lineNumbers: true,
      viewportMargin: Infinity,
      firstLineNumber: 0,
      fixedGutter: false,
    }
    
    editor.setOptions({ selectionStyle: "line" })
  }
  
  render() {
    return React.createElement(AceEditor, {
      ref: value => {
        console.log({ value })
        return this.editor = value ? value.editor : this.editor
      },
      mode: 'text',
      theme: 'github',
      name: 'ReactAceEditor',
      onChange: this.update,
      style: { flex: 1 },
      value: this.state.text,
      width: '100%',
      editorProps: {
        $blockScrolling: true
      }
    })
  }
}

function read(text) {
  
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
  }
  
  let note = parseInt(text.slice(-1), 36);
  let string = getNote(mappings[text.split('|')[0]]);
  // log('read', { text, note, string })
  return isNaN(note) ? null : note + string - 38;
}

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


ReactDOM.render(React.createElement(App), document.getElementById('root'));
