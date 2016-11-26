import React, { Component } from 'react';
// import CodeMirror from 'react-codemirror';
var CodeMirror = require('react-codemirror');

export default class Editor extends Component {

  constructor(props) {
    super(props);
    this.state = { code: "// Code" };
  }

  update = code => this.setState({ code });

  render = () => <CodeMirror
    style={{ width: 500, height: 500 }}
    value={this.state.code}
    onChange={this.update}
    options={this.props.options}
  />
}
