import React, { Component } from 'react'
import CodeMirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'
import debug from 'debug'

const log = debug('component:Editor')

export default class Editor extends Component {

  componentDidMount = () => {
    log('componentDidMount')
    this.instance.codeMirror.on('cursorActivity', this.props.cursorActivity);
    this.instance.codeMirror.on('keyHandled', this.props.keyHandled)
  }

  shouldComponentUpdate(nextProps, nextState) {
    log('shouldComponentUpdate', { nextProps, nextState })
    if (nextProps.ranges !== this.props.ranges) {
      this.setSelections(nextProps.ranges);
    }
    return true;
  }

  cursorsLeft = () => {
    log('cursorsLeft')
    this.instance.codeMirror.execCommand('goCharLeft');
  }

  cursorsRight = () => {
    log('cursorsRight')
    this.instance.codeMirror.execCommand('goCharRight');
  }

  getSelections = () => {
    log('getSelections')
    return this.instance.codeMirror.listSelections();
  }

  setSelections = ranges => {
    log('setSelections', { ranges })
    return this.instance.codeMirror.setSelections(ranges);
  }

  moveCursors = (x, y) => {
    log('moveCursors', { x, y })
    return this.setSelections(this.getSelections().map(({
      anchor: { ch: a, line: b },
      head: { ch: c, line: d } }
    ) => ({
      anchor: { ch: a + x, line: b + y},
      head: { ch: c + x, line: d + y},
    })))
  }

  render = () =>
    <CodeMirror
      ref={value => this.instance = value}
      className="ReactCodeMirror"
      value={this.props.children}
      onChange={this.props.update}
      options={this.props.options}
    />;
}
