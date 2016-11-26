import React, { Component } from 'react';
// import CodeMirror from 'react-codemirror';
var CodeMirror = require('react-codemirror');
require('codemirror/lib/codemirror.css');

export default class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = { code: "// Code" };
  }

  render = () => <CodeMirror className="ReactCodeMirror"
    // style={{ width: 500, height: 500 }}
    value={this.props.children}
    onChange={this.props.update}
    options={this.props.options}
  />
}
