import React, { Component } from 'react'
import CodeMirror from 'react-codemirror'
import AceEditor from 'react-ace'
import 'codemirror/lib/codemirror.css'
import brace from 'brace';
import 'brace/mode/java';
import 'brace/theme/github';
import debug from 'debug'

const log = debug('component:Editor')

export default class Editor extends Component {

  componentDidMount = () => {
    log('componentDidMount', this)
    const { props, instance } = this;
    const { ace, cursorActivity } = props;
    ace ? instance.onCursorChange(cursorActivity) : instance.codeMirror.on('cursorActivity', cursorActivity);
    // this.instance.codeMirror.on('keyHandled', this.props.keyHandled)
    
    if (ace) {
      let { editor } = instance;
      
      
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
      
      editor.setOptions({
        selectionStyle: "line"
      })
    }
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   log('shouldComponentUpdate', { nextProps, nextState })
  //   if (nextProps.ranges !== this.props.ranges) {
  //     this.setSelections(nextProps.ranges);
  //   }
  //   return true;
  // }

  cursorsLeft = () => {
    log('cursorsLeft')
    const {
      props: {
        ace,
      },
      instance: {
        editor,
      }
    } = this;
    editor.execCommand('gotoleft');
    // this.instance.codeMirror.execCommand('goCharLeft');
  }

  cursorsRight = () => {
    log('cursorsRight')
    const {
      props: {
        ace,
      },
      instance: {
        editor,
      }
    } = this;
    editor.execCommand('gotoright');
    // this.instance.codeMirror.execCommand('goCharRight');
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

  render = () => {
    const {
      props: {
        keyHandled,
        ace,
        update,
        children,
        options,
      }
    } = this;
    
    log('render', this)
    
    return ace ? <AceEditor
      ref={value => this.instance = value}
      mode="java"
      theme="github"
      onChange={update}
      onKeydown={keyHandled}
      name="ReactAceEditor"
      value={children}
      editorProps={{$blockScrolling: true}}
      style={{
        flex: 1,
      }}
      width="100%"
    /> : <CodeMirror
      ref={value => this.instance = value}
      className="ReactCodeMirror"
      value={children}
      onChange={update}
      options={options}
    />;
  }
}
