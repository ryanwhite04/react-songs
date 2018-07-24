import React, { Component } from 'react'
import CodeMirror from 'react-codemirror'
import 'codemirror/lib/codemirror.css'

export default class Editor extends Component {

  componentDidMount = () => {
    console.log('Editor', 'componentDidMount')
    this.instance.codeMirror.on('cursorActivity', this.props.cursorActivity);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.ranges !== this.props.ranges) {
      this.setSelections(nextProps.ranges);
    }
    return true;
  }

  cursorsLeft = () => this.instance.codeMirror.execCommand('goCharLeft');

  cursorsRight = () =>this.instance.codeMirror.execCommand('goCharRight');

  getSelections = () => this.instance.codeMirror.listSelections();

  setSelections = ranges => this.instance.codeMirror.setSelections(ranges);

  moveCursors = (x, y) => this.setSelections(this.getSelections().map(({
    anchor: { ch: a, line: b },
    head: { ch: c, line: d } }
  ) => ({
    anchor: { ch: a + x, line: b + y},
    head: { ch: c + x, line: d + y},
  })))

  render = () =>
    <CodeMirror
      ref={value => this.instance = value}
      className="ReactCodeMirror"
      value={this.props.children}
      onChange={this.props.update}
      options={this.props.options}
    />;
}
